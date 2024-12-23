<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryStock;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class StatisticalController extends Controller
{

    public function NgayThongKe()
    {
        try {
            $ranges = [
                [
                    'label' => '1 Ngày',
                    'value' => 'one_day',
                    'startDate' => now()->startOfDay()->format('d M Y'),
                    'endDate' => now()->endOfDay()->format('d M Y'),
                ],
                [
                    'label' => '1 Tuần',
                    'value' => 'one_week',
                    'startDate' => now()->startOfWeek()->format('d M Y'),
                    'endDate' => now()->endOfWeek()->format('d M Y'),
                ],
                [
                    'label' => '1 Tháng',
                    'value' => 'one_month',
                    'startDate' => now()->startOfMonth()->format('d M Y'),
                    'endDate' => now()->endOfMonth()->format('d M Y'),
                ],
                [
                    'label' => '6 Tháng',
                    'value' => 'six_months',
                    'startDate' => now()->subMonths(6)->startOfMonth()->format('d M Y'),
                    'endDate' => now()->format('d M Y'),
                ],
                [
                    'label' => '1 Năm',
                    'value' => 'one_year',
                    'startDate' => Carbon::createFromDate(2024, 1, 1)->startOfDay()->format('d M Y'),
                    'endDate' => now()->format('d M Y'),
                ],
                [
                    'label' => 'Tất cả',
                    'value' => 'all',
                    'startDate' => Order::min('created_at')
                        ? Carbon::parse(Order::min('created_at'))->format('d M Y')
                        : now()->format('d M Y'),
                    'endDate' => now()->addDay()->format('d M Y'),
                ],
            ];

            return response()->json($ranges);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function doanhThu(Request $request)
    {
        try {
            $type = $request->type;
            $fromDate = $request->from_date;
            $toDate = $request->to_date;

            $query = Order::where('status_order', 'delivered');

            // Kiểm tra loại thời gian (type) và áp dụng điều kiện tương ứng
            match ($type) {
                'day' => $query->whereDate('created_at', today()),
                'month' => $query->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year),
                '6months' => $query->whereBetween('created_at', [
                    now()->subMonths(6)->startOfMonth(),
                    now()->endOfMonth()
                ]),
                'year' => $query->whereYear('created_at', now()->year),
                'last_month' => $query->whereMonth('created_at', now()->subMonth()->month)
                    ->whereYear('created_at', now()->year),
                default => $query,
            };

            if ($fromDate && $toDate) {
                $query->whereBetween('created_at', [$fromDate, $toDate]);
            }

            // Kiểm tra và định dạng ngày hợp lệ
            if ($fromDate && !strtotime($fromDate)) {
                return response()->json(['error' => 'Ngày bắt đầu không hợp lệ'], 400);
            }

            if ($toDate && !strtotime($toDate)) {
                return response()->json(['error' => 'Ngày kết thúc không hợp lệ'], 400);
            }

            if ($fromDate && $toDate && strtotime($fromDate) > strtotime($toDate)) {
                return response()->json(['error' => 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu'], 400);
            }
            $totalRevenue = $query->sum('final_total');

            $result = $query->get(['created_at', 'final_total'])
                ->groupBy(function ($order) {
                    return Carbon::parse($order->created_at)
                        ->timezone('Asia/Ho_Chi_Minh')
                        ->startOfDay()
                        ->timestamp * 1000;
                })
                ->sortKeys()
                ->map(function ($group, $timestamp) {
                    return [$timestamp, $group->sum('final_total')];
                })
                ->values();

            return response()->json([
                'data' => $result,
                'total_revenue' => (float) $totalRevenue
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    public function thongKeSanPham(Request $request)
    {
        try {
            $type = $request->type ?? 'all';
            $fromDate = $request->from_date;
            $toDate = $request->to_date;

            // Kiểm tra giá trị 'type' có hợp lệ
            if (!in_array($type, ['all', 'day', 'week', 'month', '6months', 'year', 'last_month'])) {
                return response()->json([
                    'error' => 'Tham số type không hợp lệ. Chỉ chấp nhận: all, day, month, 6months, year, last_month.',
                ], 400);
            }

            \Log::info('Type:', ['type' => $type]);

            $totalProducts = Product::count();

            // Lấy điều kiện thời gian dựa trên tham số 'type'
            $dateCondition = $this->getDateCondition($type);

            // Nếu có `from_date` và `to_date`, thêm điều kiện thời gian từ request
            if ($fromDate && $toDate) {
                $fromDate = Carbon::parse($fromDate)->startOfDay();
                $toDate = Carbon::parse($toDate)->endOfDay();

                $dateCondition = function ($query, $column) use ($fromDate, $toDate, $dateCondition) {
                    $query->whereBetween($column, [$fromDate, $toDate]);

                    // Nếu đã có điều kiện `dateCondition`, áp dụng nó song song
                    if ($dateCondition) {
                        $dateCondition($query, $column);
                    }
                };
            }

            // Kiểm tra và định dạng ngày hợp lệ
            if ($fromDate && !strtotime($fromDate)) {
                return response()->json(['error' => 'Ngày bắt đầu không hợp lệ'], 400);
            }

            if ($toDate && !strtotime($toDate)) {
                return response()->json(['error' => 'Ngày kết thúc không hợp lệ'], 400);
            }

            if ($fromDate && $toDate && strtotime($fromDate) > strtotime($toDate)) {
                return response()->json(['error' => 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu'], 400);
            }
            // Thống kê sản phẩm bán chạy nhất
            $topSellingProducts = Product::with([
                'variants' => function ($query) use ($dateCondition) {
                    $query->withSum([
                        'orderItems as total_revenue' => function ($query) use ($dateCondition) {
                            $query->select(DB::raw('SUM(order_items.total_price)'))
                                ->join('orders', 'orders.id', '=', 'order_items.order_id')
                                ->where('orders.status_order', Order::STATUS_ORDER_DELIVERED);
                            if ($dateCondition) {
                                $dateCondition($query, 'orders.created_at');
                            }
                        },
                        'orderItems as total_quantity_sold' => function ($query) use ($dateCondition) {
                            $query->select(DB::raw('SUM(order_items.quantity)'))
                                ->join('orders', 'orders.id', '=', 'order_items.order_id')
                                ->where('orders.status_order', Order::STATUS_ORDER_DELIVERED);
                            if ($dateCondition) {
                                $dateCondition($query, 'orders.created_at');
                            }
                        }
                    ], 'quantity');
                },
                'category:id,name',
                'variants.attributeValues'
            ])
                ->withCount([
                    'rates as average_rating' => function ($query) {
                        $query->select(DB::raw('AVG(rating)'));
                    },
                    'rates as total_ratings_count' => function ($query) {
                        $query->select(DB::raw('COUNT(*)'));
                    }
                ])
                ->get()
                ->map(function ($product) {
                    $product->total_revenue = $product->variants->sum('total_revenue') ?? 0;
                    $product->total_quantity_sold = $product->variants->sum('total_quantity_sold') ?? 0;

                    // Tính tổng số lượng tồn kho của toàn bộ sản phẩm
                    $product->inventory = InventoryStock::whereIn('variant_id', $product->variants->pluck('id'))
                        ->sum('quantity') ?? 0;

                    // Tính tổng số lượng tồn kho cho từng variant
                    $product->variants->each(function ($variant) {
                        $variant->stock_quantity = InventoryStock::where('variant_id', $variant->id)
                            ->sum('quantity') ?? 0;
                    });

                    $product->average_rating = $product->average_rating ? round($product->average_rating * 2) / 2 : 0;
                    $product->total_ratings_count = $product->total_ratings_count ?? 0;
                    $product->images = json_decode($product->images, true);
                    return $product;
                })
                ->sortByDesc('total_revenue')
                ->take(10)
                ->values();

            // Thống kê sản phẩm theo đánh giá cao nhất
            $topRatedProductsQuery = Product::query()
                ->withAvg('rates', 'rating')
                ->withCount('rates')
                ->having('rates_avg_rating', '>', 0)
                ->with('category:id,name');

            if ($dateCondition) {
                $topRatedProductsQuery->whereHas('rates', function ($query) use ($dateCondition) {
                    $dateCondition($query, 'rates.created_at');
                });
            }

            $topRatedProducts = $topRatedProductsQuery
                ->orderByDesc('rates_avg_rating')
                ->take(10)
                ->get()
                ->map(function ($product) {
                    $product->rates_avg_rating = round($product->rates_avg_rating * 2) / 2;
                    $product->images = json_decode($product->images, true);
                    return $product;
                });

            // Thống kê sản phẩm theo đánh giá thấp nhất
            $lowestRatedProductsQuery = Product::query()
                ->withAvg('rates', 'rating')
                ->withCount('rates')
                ->having('rates_avg_rating', '>', 0)
                ->with('category:id,name');

            if ($dateCondition) {
                $lowestRatedProductsQuery->whereHas('rates', function ($query) use ($dateCondition) {
                    $dateCondition($query, 'rates.created_at');
                });
            }

            $lowestRatedProducts = $lowestRatedProductsQuery
                ->orderBy('rates_avg_rating')
                ->take(10)
                ->get()
                ->map(function ($product) {
                    $product->rates_avg_rating = round($product->rates_avg_rating * 2) / 2;
                    $product->images = json_decode($product->images, true);
                    return $product;
                });

            // Trả về kết quả thống kê
            return response()->json([
                'total_products' => $totalProducts,
                'top_selling_products' => $topSellingProducts,
                'top_rated_products' => $topRatedProducts,
                'lowest_rated_products' => $lowestRatedProducts,
            ]);
        } catch (\Exception $e) {
            // Xử lý lỗi
            return response()->json([
                'error' => true,
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    private function getDateCondition($type)
    {
        switch ($type) {
            case 'day':
                return function ($query, $dateColumn) {
                    $query->whereDate($dateColumn, today());
                };
            case 'week':
                return function ($query, $dateColumn) {
                    $query->whereBetween($dateColumn, [
                        now()->startOfWeek(),
                        now()->endOfWeek()
                    ]);
                };
            case 'month':
                return function ($query, $dateColumn) {
                    $query->whereMonth($dateColumn, now()->month)
                        ->whereYear($dateColumn, now()->year);
                };
            case '6months':
                return function ($query, $dateColumn) {
                    $query->whereBetween($dateColumn, [
                        now()->subMonths(6)->startOfMonth(),
                        now()->endOfMonth()
                    ]);
                };
            case 'year':
                return function ($query, $dateColumn) {
                    $query->whereYear($dateColumn, now()->year);
                };
            case 'last_month':
                return function ($query, $dateColumn) {
                    $query->whereMonth($dateColumn, now()->subMonth()->month)
                        ->whereYear($dateColumn, now()->year);
                };
            default:
                return null;
        }
    }



    //thống kê đơn hangf
    public function thongKeDonHang(Request $request)
    {
        try {
            $type = $request->query('type', 'all'); // Loại thống kê: 'all', 'day', 'month', '6months', 'year', 'last_month'

            // Kiểm tra giá trị 'type' có hợp lệ
            if (!in_array($type, ['all', 'day', 'month', '6months', 'year', 'last_month'])) {
                return response()->json([
                    'error' => 'Tham số type không hợp lệ. Chỉ chấp nhận: all, day, month, 6months, year, last_month.',
                ], 400);
            }

            // Tạo query cơ bản để áp dụng điều kiện thời gian
            $baseQuery = Order::query();

            // Áp dụng điều kiện thời gian
            $baseQuery->when($type === 'day', fn($q) => $q->whereDate('created_at', now()))
                ->when($type === 'month', fn($q) => $q->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year))
                ->when($type === '6months', fn($q) => $q->whereBetween('created_at', [
                    now()->subMonths(6)->startOfDay(),
                    now()->endOfDay()
                ]))
                ->when($type === 'year', fn($q) => $q->whereYear('created_at', now()->year))
                ->when($type === 'last_month', fn($q) => $q->whereMonth('created_at', now()->subMonth()->month)
                    ->whereYear('created_at', now()->subMonth()->year));

            // Tổng số đơn hàng
            $totalOrders = $baseQuery->count();

            // Đơn hàng đã giao
            $deliveredOrders = (clone $baseQuery)
                ->where('status_order', Order::STATUS_ORDER_DELIVERED)
                ->count();

            // Đơn hàng bị hủy
            $canceledOrders = (clone $baseQuery)
                ->where('status_order', Order::STATUS_ORDER_CANCELED)
                ->count();

            // Thống kê theo phương thức thanh toán
            $paymentMethods = $baseQuery->select('payment_method', DB::raw('COUNT(*) as count'))
                ->groupBy('payment_method')
                ->get();

            return response()->json([
                'total_orders' => $totalOrders,
                'delivered_orders' => $deliveredOrders,
                'canceled_orders' => $canceledOrders,
                'payment_methods' => $paymentMethods,
            ]);
        } catch (\Exception $e) {
            // Xử lý lỗi
            return response()->json([
                'error' => true,
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    //thôgns kê lại doanh thu trongngay,đơn hàng mới,đơn hàng chưa xác nhận,và đếm số ng dùng
    public function thongKeNgay(Request $request)
    {
        try {
            $today = now()->startOfDay();
            $endOfDay = now()->endOfDay();

            $revenueToday = Order::where('status_order', 'delivered')
                ->whereBetween('updated_at', [$today, $endOfDay])
                ->sum('final_total');

            // Số đơn hàng mới trong ngày
            $newOrdersCount = Order::whereBetween('created_at', [$today, $endOfDay])->count();

            // Số đơn hàng chờ xác nhận
            $pendingOrdersCount = Order::where('status_order', 'pending')->count();

            $totalUsers = User::count();

            // Trả về kết quả thống kê
            return response()->json([
                'revenue_today' => $revenueToday,
                'new_orders_count' => $newOrdersCount,
                'pending_orders_count' => $pendingOrdersCount,
                'total_users' => $totalUsers,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function listSoLuongBienTheDuoi10(): JsonResponse
    {
        try {
            $variants = InventoryStock::with(['variant.attributeValues', 'variant.product'])
                ->where('quantity', '<', 10)
                ->where('quantity', '>', 0)
                ->paginate(10);

            $variants->getCollection()->transform(function ($inventoryStock) {
                if (isset($inventoryStock->variant->product->images)) {
                    if (!is_array($inventoryStock->variant->product->images)) {
                        $inventoryStock->variant->product->images = json_decode($inventoryStock->variant->product->images, true);
                    }
                }
                return $inventoryStock;
            });

            return response()->json([
                'variants' => $variants,
                'count' => $variants->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Đã xảy ra lỗi khi lấy danh sách biến thể có số lượng dưới 10.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function listSoLuongBienTheDaHet(): JsonResponse
    {
        try {
            $variants = InventoryStock::with(['variant.attributeValues', 'variant.product'])
                ->where('quantity', '=', 0)
                ->paginate(10);

            $variants->getCollection()->transform(function ($inventoryStock) {
                if (isset($inventoryStock->variant->product->images)) {
                    if (!is_array($inventoryStock->variant->product->images)) {
                        $inventoryStock->variant->product->images = json_decode($inventoryStock->variant->product->images, true);
                    }
                }
                return $inventoryStock;
            });

            return response()->json([
                'variants' => $variants,
                'count' => $variants->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Đã xảy ra lỗi khi lấy danh sách biến thể đã hết hàng.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    public function profit(Request $request)
    {
        try {
            $type = $request->type;
            $fromDate = $request->from_date;
            $toDate = $request->to_date;

            $query = Order::where('status_order', 'delivered');

            // Kiểm tra loại thời gian (type) và áp dụng điều kiện tương ứng
            match ($type) {
                'day' => $query->whereDate('created_at', today()),
                'month' => $query->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year),
                '6months' => $query->whereBetween('created_at', [
                    now()->subMonths(6)->startOfMonth(),
                    now()->endOfMonth()
                ]),
                'year' => $query->whereYear('created_at', now()->year),
                'last_month' => $query->whereMonth('created_at', now()->subMonth()->month)
                    ->whereYear('created_at', now()->year),
                default => $query,
            };

            // Kiểm tra nếu có tham số from_date và to_date, áp dụng điều kiện filter theo khoảng thời gian
            if ($fromDate && $toDate) {
                $query->whereBetween('created_at', [$fromDate, $toDate]);
            }

            // Kiểm tra và định dạng ngày hợp lệ
            if ($fromDate && !strtotime($fromDate)) {
                return response()->json(['error' => 'Ngày bắt đầu không hợp lệ'], 400);
            }

            if ($toDate && !strtotime($toDate)) {
                return response()->json(['error' => 'Ngày kết thúc không hợp lệ'], 400);
            }

            if ($fromDate && $toDate && strtotime($fromDate) > strtotime($toDate)) {
                return response()->json(['error' => 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu'], 400);
            }

            $totalRevenue = $query->sum('profit');

            $result = $query->get(['created_at', 'profit'])
                ->groupBy(function ($order) {
                    return Carbon::parse($order->created_at)
                        ->timezone('Asia/Ho_Chi_Minh')
                        ->startOfDay()
                        ->timestamp * 1000;
                })
                ->sortKeys()
                ->map(function ($group, $timestamp) {
                    return [$timestamp, $group->sum('profit')];
                })
                ->values();

            return response()->json([
                'data' => $result,
                'total_revenue' => (float) $totalRevenue
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }



    //thống kê tất cả sản phẩm
    public function thongKeSanPhamAll(Request $request)
    {
        try {
            $type = $request->type ?? 'all';

            // Kiểm tra giá trị 'type' có hợp lệ
            if (!in_array($type, ['all', 'day', 'week', 'month', '6months', 'year', 'last_month'])) {
                return response()->json([
                    'error' => 'Tham số type không hợp lệ. Chỉ chấp nhận: all, day, week, month, 6months, year, last_month.',
                ], 400);
            }

            // Lấy từ ngày và đến ngày từ request
            $fromDate = $request->query('from_date');
            $toDate = $request->query('to_date');

            // Kiểm tra và định dạng ngày hợp lệ
            if ($fromDate && !strtotime($fromDate)) {
                return response()->json(['error' => 'Ngày bắt đầu không hợp lệ'], 400);
            }

            if ($toDate && !strtotime($toDate)) {
                return response()->json(['error' => 'Ngày kết thúc không hợp lệ'], 400);
            }

            // Kiểm tra nếu cả hai ngày đều được cung cấp
            if ($fromDate && $toDate && strtotime($fromDate) > strtotime($toDate)) {
                return response()->json(['error' => 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu'], 400);
            }

            \Log::info('Type:', ['type' => $type]);

            $dateCondition = $this->getDateCondition($type);

            // Thêm điều kiện lọc ngày nếu có
            if ($fromDate && $toDate) {
                $dateCondition = function ($query, $column) use ($fromDate, $toDate) {
                    $query->whereBetween($column, [$fromDate, $toDate]);
                };
            }

            // Số lượng sản phẩm mỗi trang (mặc định là 10)
            $perPage = $request->input('per_page', 10);

            // Lấy toàn bộ dữ liệu sản phẩm
            $allProducts = Product::with([
                'variants' => function ($query) use ($dateCondition) {
                    $query->withSum([
                        'orderItems as total_revenue' => function ($query) use ($dateCondition) {
                            $query->select(DB::raw('SUM(order_items.total_price)'))
                                ->join('orders', 'orders.id', '=', 'order_items.order_id')
                                ->where('orders.status_order', Order::STATUS_ORDER_DELIVERED);
                            if ($dateCondition) {
                                $dateCondition($query, 'orders.created_at');
                            }
                        },
                        'orderItems as total_quantity_sold' => function ($query) use ($dateCondition) {
                            $query->select(DB::raw('SUM(order_items.quantity)'))
                                ->join('orders', 'orders.id', '=', 'order_items.order_id')
                                ->where('orders.status_order', Order::STATUS_ORDER_DELIVERED);
                            if ($dateCondition) {
                                $dateCondition($query, 'orders.created_at');
                            }
                        }
                    ], 'total_price');
                },
                'category:id,name',
                'variants.attributeValues'
            ])->get();

            // Tính toán và sắp xếp giảm dần theo total_revenue
            $sortedProducts = $allProducts->map(function ($product) {
                $product->total_revenue = $product->variants->sum('total_revenue') ?? 0;
                $product->total_quantity_sold = $product->variants->sum('total_quantity_sold') ?? 0;

                // Tính tổng số lượng tồn kho
                $product->total_stock_quantity = InventoryStock::whereIn('variant_id', $product->variants->pluck('id'))
                    ->sum('quantity');

                // Tính tồn kho cho từng variant
                $product->variants->each(function ($variant) {
                    $variant->stock_quantity = InventoryStock::where('variant_id', $variant->id)
                        ->sum('quantity');
                });

                // Tính trung bình đánh giá
                $averageRating = $product->rates()->avg('rating') ?? 0;
                $averageRating = round($averageRating * 2) / 2;
                $product->average_rating = $averageRating;

                $product->images = json_decode($product->images, true);

                return $product;
            })->sortByDesc('total_revenue')
                ->values();

            $page = $request->input('page', 1);
            $paginatedProducts = new \Illuminate\Pagination\LengthAwarePaginator(
                $sortedProducts->forPage($page, $perPage),
                $sortedProducts->count(),
                $perPage,
                $page
            );

            // Trả về kết quả phân trang
            return response()->json($paginatedProducts);

        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }


    // Thống kê chi tiết từng sản phẩm
    public function thongKeProductDetailBySlug($slug, Request $request)
    {
        try {
            // Lấy từ ngày và đến ngày từ request
            $fromDate = $request->query('from_date');
            $toDate = $request->query('to_date');

            // Kiểm tra và định dạng ngày hợp lệ
            if ($fromDate && !strtotime($fromDate)) {
                return response()->json(['error' => 'Ngày bắt đầu không hợp lệ'], 400);
            }

            if ($toDate && !strtotime($toDate)) {
                return response()->json(['error' => 'Ngày kết thúc không hợp lệ'], 400);
            }

            // Lấy sản phẩm theo slug
            $product = Product::with([
                'variants' => function ($query) use ($fromDate, $toDate) {
                    $query->withSum([
                        'orderItems as total_revenue' => function ($query) use ($fromDate, $toDate) {
                            $query->select(DB::raw('SUM(order_items.total_price)'))
                                ->join('orders', 'orders.id', '=', 'order_items.order_id')
                                ->where('orders.status_order', Order::STATUS_ORDER_DELIVERED)
                                ->when($fromDate, function ($query, $fromDate) {
                                    $query->whereDate('orders.created_at', '>=', $fromDate);
                                })
                                ->when($toDate, function ($query, $toDate) {
                                    $query->whereDate('orders.created_at', '<=', $toDate);
                                });
                        },
                        'orderItems as total_quantity_sold' => function ($query) use ($fromDate, $toDate) {
                            $query->select(DB::raw('SUM(order_items.quantity)'))
                                ->join('orders', 'orders.id', '=', 'order_items.order_id')
                                ->where('orders.status_order', Order::STATUS_ORDER_DELIVERED)
                                ->when($fromDate, function ($query, $fromDate) {
                                    $query->whereDate('orders.created_at', '>=', $fromDate);
                                })
                                ->when($toDate, function ($query, $toDate) {
                                    $query->whereDate('orders.created_at', '<=', $toDate);
                                });
                        }
                    ], 'total_price');
                },
                'category:id,name',
                'variants.attributeValues'
            ])->where('slug', $slug)->firstOrFail();

            $minPrice = $product->variants->min('price');
            $maxPrice = $product->variants->max('price');

            $product->price_range = $minPrice . '-' . $maxPrice;

            // Tính tổng số lượng tồn kho của toàn bộ sản phẩm
            $stockQuantity = InventoryStock::whereIn('variant_id', $product->variants->pluck('id'))
                ->sum('quantity');

            // Tính tổng số lượng tồn kho cho từng variant
            $product->variants->each(function ($variant) use ($fromDate, $toDate) {
                // Tính số lượng bị hủy cho từng variant
                $variant->canceled_quantity = OrderItem::where('variant_id', $variant->id)
                    ->join('orders', 'orders.id', '=', 'order_items.order_id')
                    ->where('orders.status_order', Order::STATUS_ORDER_CANCELED)
                    ->when($fromDate, function ($query, $fromDate) {
                        $query->whereDate('orders.created_at', '>=', $fromDate);
                    })
                    ->when($toDate, function ($query, $toDate) {
                        $query->whereDate('orders.created_at', '<=', $toDate);
                    })
                    ->sum('order_items.quantity');

                // Tính số lượng tồn kho cho từng variant
                $variant->stock_quantity = InventoryStock::where('variant_id', $variant->id)
                    ->sum('quantity');
            });

            // Tổng hợp số liệu
            $product->total_revenue = $product->variants->sum('total_revenue') ?? 0;
            $product->total_quantity_sold = $product->variants->sum('total_quantity_sold') ?? 0;
            $product->stock_quantity = $stockQuantity ?? 0; // Gán giá trị tổng số lượng từ inventory_stocks cho toàn bộ sản phẩm
            $product->images = json_decode($product->images, true);

            //tổng sản phẩm bị hủy
            $product->canceled_quantity = $product->variants->sum('canceled_quantity') ?? 0;

            // Tính trung bình đánh giá
            $averageRating = $product->rates()->avg('rating') ?? 0;
            $averageRating = round($averageRating * 2) / 2;
            $product->average_rating = $averageRating;

            $product->total_reviews = $product->rates->count() ?? 0;

            return response()->json([
                'data' => $product,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }




    //top 10 sản phẩm được yêu thích
    public function top10YeuThich(Request $request)
    {
        $type = $request->type ?? 'all';

        // Kiểm tra giá trị 'type' có hợp lệ
        if (!in_array($type, ['all', 'day', 'week', 'month', '6months', 'year', 'last_month'])) {
            return response()->json([
                'error' => 'Tham số type không hợp lệ. Chỉ chấp nhận: all, day, week, month, 6months, year, last_month.',
            ], 400);
        }

        $timeFrame = null;
        switch ($type) {
            case 'day':
                $timeFrame = now()->subDay();
                break;
            case 'week':
                $timeFrame = now()->subWeek();
                break;
            case 'month':
                $timeFrame = now()->subMonth();
                break;
            case '6months':
                $timeFrame = now()->subMonths(6);
                break;
            case 'year':
                $timeFrame = now()->subYear();
                break;
            case 'all':
            default:
                $timeFrame = null;
        }

        // Lấy từ ngày và đến ngày từ request
        $fromDate = $request->query('from_date');
        $toDate = $request->query('to_date');

        // Kiểm tra và định dạng ngày hợp lệ
        if ($fromDate && !strtotime($fromDate)) {
            return response()->json(['error' => 'Ngày bắt đầu không hợp lệ'], 400);
        }

        if ($toDate && !strtotime($toDate)) {
            return response()->json(['error' => 'Ngày kết thúc không hợp lệ'], 400);
        }

        if ($fromDate && $toDate && strtotime($fromDate) > strtotime($toDate)) {
            return response()->json(['error' => 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu'], 400);
        }

        // Lấy các sản phẩm yêu thích nhất từ model Product
        $query = Product::select('products.id', 'products.name', 'products.images', \DB::raw('COUNT(wishlists.product_id) as favorites_count'))
            ->join('wishlists', 'wishlists.product_id', '=', 'products.id');

        // Thêm điều kiện lọc theo thời gian nếu có
        if ($type === 'last_month') {
            $query->whereBetween('wishlists.created_at', $timeFrame);
        } elseif ($timeFrame) {
            $query->where('wishlists.created_at', '>=', $timeFrame);
        }

        // Thêm điều kiện lọc theo khoảng thời gian từ ngày và đến ngày
        if ($fromDate && $toDate) {
            $query->whereBetween('wishlists.created_at', [Carbon::parse($fromDate)->startOfDay(), Carbon::parse($toDate)->endOfDay()]);
        } elseif ($fromDate) {
            $query->where('wishlists.created_at', '>=', Carbon::parse($fromDate)->startOfDay());
        } elseif ($toDate) {
            $query->where('wishlists.created_at', '<=', Carbon::parse($toDate)->endOfDay());
        }

        $top10Favorites = $query
            ->groupBy('products.id', 'products.name', 'products.images')
            ->orderByDesc('favorites_count')
            ->limit(10)
            ->get();

        $top10Favorites->each(function ($product) {
            $product->images = json_decode($product->images);
        });

        return response()->json([
            'top_10_wishlist' => $top10Favorites,
        ]);
    }



}
