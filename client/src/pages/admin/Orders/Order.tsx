import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Orders } from "../../../interfaces/IOrders";
import instance from "../../../instance/instance";
import { toast } from "react-toastify";
import { Button, Checkbox, Input, Select} from 'antd';
import { DatePicker } from 'antd';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from "dayjs";
import axios from "axios";
dayjs.extend(isBetween);
const Orders = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]); // Mảng lưu các mã đơn hàng được chọn
  const [orders, setOrders] = useState<Orders[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDateRange, setSearchDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const OPTIONS = ['pending', 'confirmed', 'preparing_goods', 'shipping', 'delivered', 'canceled'];
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // Lưu trạng thái đã chọn
  const [errorMessage, setErrorMessage] = useState<string>(""); // Lưu thông báo lỗi nếu có
  // Hàm xử lý tìm kiếm

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };
  const handleDateSearch = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null, dateStrings: [string, string]) => {
    if (dates) {
      // Kiểm tra nếu dates không null
      setSearchDateRange([dates[0]!, dates[1]!]); // Chỉ lưu giá trị không null
    } else {
      setSearchDateRange(null); // Nếu không chọn khoảng ngày, đặt là null
    }
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allOrderIds = filteredOrders
        .map((order) => order.id)
        .filter((id): id is number => id !== undefined) // Loại bỏ undefined
        .map((id) => id.toString()); // Chuyển sang string[]
      setSelectedOrders(allOrderIds); // Gán mảng string[]
    } else {
      setSelectedOrders([]); // Reset
    }
  };


  const handleSelectOrder = (checked: boolean, id: string | number) => {
    const normalizedId = typeof id === 'number' ? id.toString() : id; // Hoặc đảm bảo id là string
    if (checked) {
      setSelectedOrders([...selectedOrders, normalizedId]);
    } else {
      setSelectedOrders(selectedOrders.filter((order) => order !== normalizedId));
    }

  };

  // Lọc danh sách đơn hàng theo mã sản phẩm
  const filteredOrders = orders.filter((item) => {
    const matchesCode = item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedItems.length === 0 || selectedItems.includes(item.status_order);
    const matchesDate = searchDateRange
      ? dayjs(item.created_at).isBetween(searchDateRange[0], searchDateRange[1], null, '[]')
      : true;

    return matchesCode && matchesStatus && matchesDate;
  });

  const navigate = useNavigate();
  const { Search } = Input;
  const getStatusBackground = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 bg-opacity-100"; // Chờ xử lý
      case "confirmed":
        return "bg-green-100 bg-opacity-100";// Chờ xử lý
      case "preparing_goods":
        return "bg-yellow-200 bg-opacity-100";
      case "shipping":
        return "bg-orange-100 bg-opacity-100";  // Đang giao
      case "delivered":
        return "bg-green-200 bg-opacity-100"; // Đã giao
      case "canceled":
        return "bg-red-200 bg-opacity-100"; // Đã hủy
      default:
        return "bg-gray-500 bg-opacity-100"; // Trạng thái không xác định
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500"; // Chờ xử lý
      case "confirmed":
        return "text-green-500"; // Đã xác nhận
      case "preparing_goods":
        return "text-yellow-500"; // Đang chuẩn bị hàng
      case "shipping":
        return "text-yellow-800";
      case "delivered":
        return "text-green-500"; // Đã giao
      case "canceled":
        return "text-red-600"; // Đã hủy
      default:
        return "text-red-500"; // Trạng thái không xác định
    }
  };
  const translateStatus = (status: string): string => {
    const statusTranslations: { [key: string]: string } = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      preparing_goods: "Đang chuẩn bị hàng",
      shipping: "Đang giao hàng",
      delivered: "Đã giao",
      canceled: "Đã hủy",
    };
    return statusTranslations[status] || "Trạng thái không xác định";
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await instance.get("admin/orders");
      // Kiểm tra nếu phản hồi không hợp lệ
      if (
        !response ||
        !response.data ||
        !response.data.data ||
        !Array.isArray(response.data.data.data)
      ) {
        throw new Error("Dữ liệu phản hồi không đúng cấu trúc.");
      }

      // Nếu dữ liệu hợp lệ, cập nhật state
      setOrders(response.data.data.data);
    } catch (error: any) {
      // Ghi log lỗi để debug
      console.error("Lỗi khi lấy đơn hàng:", error);

      // Hiển thị thông báo lỗi cho người dùng
      if (error.response) {
        // Lỗi từ phía server (4xx, 5xx)
        toast.error(`Lỗi từ server: ${error.response.data.message || "Không xác định"}`);
      } else if (error.request) {
        // Lỗi mạng hoặc không nhận được phản hồi
        toast.error("Không thể kết nối đến server. Vui lòng kiểm tra mạng.");
      } else {
        // Lỗi không mong muốn
        toast.error(`Lỗi: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };
  const handleUpdateStatus = async () => {
    if (selectedOrders.length === 0 || !selectedStatus) {
      toast.warning("Vui lòng chọn đơn hàng và trạng thái.");
      return;
    }

    if (!Array.isArray(selectedOrders)) {
      setErrorMessage("Danh sách đơn hàng không hợp lệ.");
      return;
    }

    // Kiểm tra các phần tử trong selectedOrders
    if (!selectedOrders.every((id) => typeof id === "string" || typeof id === "number")) {
      setErrorMessage("Danh sách đơn hàng chứa ID không hợp lệ.");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Reset error message

    try {
      console.log("Selected Orders:", selectedOrders); // Log giá trị để kiểm tra
      console.log("Selected Status:", selectedStatus); // Log giá trị để kiểm tra

      const response = await instance.post("admin/order-update_much", {
        ids: selectedOrders,
        status: selectedStatus,
      });

      if (response.status === 200) {
        toast.success("Cập nhật trạng thái thành công!");
        fetchOrders();
        setSelectedStatus("");
        setSelectedOrders([]);
      }
    } catch (error) {
      console.error("Đã có lỗi khi cập nhật trạng thái:", error);

      // Kiểm tra lỗi từ API
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || "Đã có lỗi xảy ra khi cập nhật trạng thái.");
      } else {
        setErrorMessage("Đã có lỗi xảy ra.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const { RangePicker } = DatePicker;
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="m-4 flex flex-wrap items-center gap-4">
        {/* Tìm kiếm theo mã đơn hàng */}
        <Search
          placeholder="Mã đơn hàng (code)"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={handleSearch}
          className="flex-1 min-w-[200px]"
        />

        {/* Chọn khoảng thời gian */}
        <RangePicker
          size="large"
          onChange={handleDateSearch}
          className="flex-1 min-w-[200px]"
        />

        {/* Bộ lọc theo trạng thái */}
        <Select
          mode="multiple"
          placeholder="Trạng thái"
          value={selectedItems}
          onChange={(value: string[]) => setSelectedItems(value)}
          onSelect={() => (document.activeElement as HTMLElement)?.blur()}
          className="flex-1 min-w-[200px]"
          options={filteredOptions.map((item) => ({
            value: item,
            label: item,
          }))}
        />

        {/* Chọn trạng thái */}
        <Select
          showSearch
          placeholder="Chọn trạng thái"
          value={selectedStatus || undefined} // Đảm bảo placeholder hiển thị khi không có giá trị
          onChange={handleStatusChange}
          className="flex-1 min-w-[200px]"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={[
            { value: "pending", label: "Chờ xác nhận" },
            { value: "confirmed", label: "Đã xác nhận" },
            { value: "preparing_goods", label: "Chuẩn bị hàng" },
            { value: "shipping", label: "Đang giao hàng" },
            { value: "delivered", label: "Đã giao hàng" },
          ]}
        />


        {/* Nút đồng bộ */}
        <Button
          type="primary"
          className="p-2 text-xs rounded-lg flex-shrink-0"
          onClick={handleUpdateStatus}
          loading={loading}
          disabled={selectedOrders.length === 0 || !selectedStatus}
        >
          Đồng bộ
        </Button>
      </div>

      <table className="min-w-full bg-white">
        <thead className="bg-primary">
          <tr>
            <th className="py-3 px-4 text-left text-xs text-white font-bold uppercase tracking-wider">
              <Checkbox
                checked={selectedOrders.length === filteredOrders.length}
                indeterminate={selectedOrders.length > 0 && selectedOrders.length < filteredOrders.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
            <th className="py-3 px-4 text-left text-xs text-white font-bold uppercase tracking-wider">STT</th>
            <th className="py-3 px-4 text-left text-xs text-white font-bold uppercase tracking-wider">Mã đơn hàng</th>
            <th className="py-3 px-4 text-left text-xs text-white font-bold uppercase tracking-wider">Tổng tiền</th>
            <th className="py-3 px-4 text-left text-xs text-white font-bold uppercase tracking-wider">Ngày đặt hàng</th>
            <th className="py-3 px-4 text-left text-xs text-white font-bold uppercase tracking-wider">Trạng thái</th>
            <th className="py-3 px-4 text-left text-xs text-white font-bold uppercase tracking-wider">Hoạt động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary-200">
          {filteredOrders.map((item, index) => (

            <tr key={item.id}>
              <td className="px-4 py-3">
                <Checkbox
                  checked={selectedOrders.includes(item.id?.toString() || '')}
                  onChange={(e) => handleSelectOrder(e.target.checked, item.id?.toString() || '')}
                />

              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-secondary-900 text-primary">
                {index + 1}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <span className="border border-primary border-dashed py-1 px-2 rounded-sm bg-primary/10 text-primary">
                  {item.code}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-primary font-bold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                }).format(item.final_total)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-primary font-bold">
                {new Date(item.created_at).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </td>
              <td
                className={`px-4 py-3 whitespace-nowrap text-sm ${getStatusColor(
                  item.status_order
                )}`}
              >
                <span
                  className={`inline-block px-3 py-1 rounded-full ${getStatusBackground(
                    item.status_order
                  )} ${getStatusColor(item.status_order)}`}
                >
                  {translateStatus(item.status_order)}
                </span>
              </td>
              <td className=" py-3 whitespace-nowrap text-sm text-red-600">
                <div className="flex justify-start">
                  <button
                    onClick={() => {
                      // Dùng `useNavigate` từ react-router-dom nếu cần điều hướng
                      navigate(`orderDetails/${item.code}`);
                    }}
                    className="flex items-center px-3 py-1 bg-primary text-white rounded  transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    Chi tiết
                  </button>
                </div>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default Orders




