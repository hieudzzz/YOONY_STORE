
import { useState, useEffect } from "react";
import { Rate, Table, TableColumnsType } from "antd";
import { FaStar } from "react-icons/fa";
import instance from "../../../instance/instance";
import { Irates } from "../../../interfaces/IRates";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import logoUser from "./champion.jpg"
import { TiArrowSyncOutline } from "react-icons/ti";
import { Link } from "react-router-dom";

interface DataType {
    imageProduct: string;
    key: React.Key;
    stt: number;
    name: string;
    product: Product;
    content: string;
    created_at: string;
    rating: number;
    image: string;
    user: User;
}
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
    address: string | null;
    tel: string | null;
    provider: string | null;
    provider_id: string | null;
    created_at: string;
    updated_at: string;
    email_verified_at: string | null;
}
interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    images: string;
    category_id: number;
    is_active: number;
    is_featured: number;
    is_good_deal: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
interface ApiResponse {
    current_page: number;
    data: Irates[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
const Rates = () => {
    const [reviews, setReviews] = useState<Irates[]>([]);
    const [tenReview, settenReview] = useState<Irates[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [displayedProducts, setDisplayedProducts] = useState<Set<number>>(new Set());
    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await instance.get<ApiResponse>("ratings");
                if (response.data && Array.isArray(response.data.data)) {
                    setReviews(response.data.data);
                } else {
                    console.error("Invalid response data");
                }
            } catch (error: any) {
                console.error("Error fetching reviews:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    useEffect(() => {
        const fetchReviewTen = async () => {
            try {
                const response = await instance.get("ratings");
                if (response.data && Array.isArray(response.data.data)) {
                    settenReview(response.data.data);
                } else {
                    console.error("Invalid response data");
                }
            } catch (error: any) {
                console.error("Error fetching reviews:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReviewTen();
    }, []);



    const tableData = reviews.map((review, index) => ({
        key: review.id,
        stt: index + 1,
        name: review.user?.name || "Không xác định",
        image: review.user?.avatar || "https://via.placeholder.com/40",
        product: review.product?.name || "Không xác định",
        content: review.content,
        imageProduct: review.product?.images[0],
        created_at: new Date(review.created_at).toLocaleDateString("vi-VN"),
        rating: review.rating,
    }));
    //Bảng dữ liệu cho table 
    const columnsAll: TableColumnsType<DataType> = [
        {
            title: "STT",
            dataIndex: "stt",
            width: 50,
        },
        {
            title: "Tên người dùng",
            dataIndex: "name",
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <img
                        src={record.image || "https://via.placeholder.com/40"}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    <span>{record.name}</span>
                </div>
            ),
        },
        {
            title: "Sản phẩm",
            dataIndex: "product",
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <img
                        src={record.imageProduct || "https://via.placeholder.com/40"}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    <span>{record.product}</span>
                </div>
            ),
        },
        {
            title: "Nội dung",
            dataIndex: "content",
            render: (text) => <span className="">{text}</span>, // Hiển thị 1 dòng
        },
        {
            title: "Thời gian",
            dataIndex: "created_at",
        },
        {
            title: "Số sao",
            dataIndex: "rating",
            filters: [
                { text: "1 sao", value: 1 },
                { text: "2 sao", value: 2 },
                { text: "3 sao", value: 3 },
                { text: "4 sao", value: 4 },
                { text: "5 sao", value: 5 },
            ],
            onFilter: (value, record) => record.rating === value,
            render: (rating: number) => (
                <Rate
                    value={rating}
                    disabled
                    className="text-primary" // Màu từ Tailwind
                />
            )
        },
    ];
    const [showTable, setShowTable] = useState(false); // Quản lý trạng thái ẩn/hiện
    const handleToggleTable = () => {
        setShowTable((prev) => !prev);
        // Đảo trạng thái show table 
    };
    const groupedReviews = tenReview.reduce((acc, rate) => {
        const productId = rate.product?.id;
        if (!productId) return acc; // Nếu không có productId, bỏ qua

        if (!acc[productId]) {
            acc[productId] = {
                product: rate.product,
                ratings: [],
            };
        }

        acc[productId].ratings.push(rate.rating); // Thêm đánh giá vào sản phẩm

        return acc;
    }, {});
    const productReviews = Object.values(groupedReviews).map(({ product, ratings }) => {
        const totalStars = ratings.reduce((acc, rating) => acc + rating, 0);
        const avgRating = totalStars / ratings.length;

        const fullStars = Math.floor(avgRating);
        const halfStar = avgRating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        let starDisplay = "";
        for (let i = 0; i < fullStars; i++) {
            starDisplay += "⭐";
        }
        if (halfStar) {
            starDisplay += "⭐";
        }
        for (let i = 0; i < emptyStars; i++) {
            starDisplay += "☆";
        }

        return {
            product,
            starDisplay,
        };
    });
    return (
        <>
            {/* <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                    <div className="mb-6">
                        <button
                            disabled
                            className="bg-primary text-white flex items-center px-2 py-2 border rounded-lg font-normal text-sm transition"
                        >
                            <TiArrowSyncOutline className="text-lg" />
                            <span className="ml-2">Top đánh giá mới</span>
                        </button>
                    </div>
                    <Swiper
                        modules={[Autoplay]}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        spaceBetween={16}
                        slidesPerView={5}
                        slidesPerGroup={1}
                        className="w-full"
                    >
                        {reviews.slice(0, 10).map((review) => (
                            <SwiperSlide key={review.id}>
                                <div className="border border-gray-300 p-4 space-y-4 rounded-md">
                                    <div className="flex space-x-1">
                                        {Array.from({ length: 5 }, (_, starIndex) => (
                                            <FaStar
                                                className={
                                                    starIndex < review.rating
                                                        ? "text-primary fill-primary"
                                                        : "text-gray-300"
                                                }
                                                key={starIndex}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10">
                                            <img
                                                src={
                                                    review.user.avatar ||
                                                    logoUser
                                                }
                                                alt="User Avatar"
                                                className="rounded-full w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">{review.user?.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString("vi-VN")}
                                            </p>

                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div> */}
            <div className="mt-4">
                <button className="bg-primary p-2 text-white rounded-md text-sm">
                    Tất cả đánh giá
                </button>
            </div>
            <div className="mt-4 mb-8">
                <Table
                    columns={columnsAll}
                    dataSource={tableData}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 800 }}
                />
            </div>
            <div className="">
                <button className="bg-primary p-2 text-white rounded-md text-sm">
                    Top sản phẩm đánh giá
                </button>
            </div>

            {/* <div className="overflow-x-auto mt-4 mb-8">
                <table className="min-w-full table-auto border-collapse bg-white rounded-md">
                    <thead className="">
                        <tr className="bg-gray-50">
                            <th className="px-6 py-4 text-sm font-medium text-gray-900 text-left">Sản phẩm</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-900 text-left">Số sao</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-900 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tenReview.map((rate, index) => {
                            console.log("images", rate.product?.images[0])
                            const rating = rate.rating;
                            const fullStars = Math.floor(rating);  // Số sao đầy (làm tròn xuống)
                            const halfStar = rating % 1 >= 0.5;    // Kiểm tra xem có nửa sao hay không
                            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);  // Số sao trống còn lại

                            // Tạo chuỗi sao
                            let starDisplay = '';
                            for (let i = 0; i < fullStars; i++) {
                                starDisplay += '⭐';  // Sao đầy
                            }
                            if (halfStar) {
                                starDisplay += '⭐';  // Nửa sao
                            }
                            for (let i = 0; i < emptyStars; i++) {
                                starDisplay += '☆';  // Sao trống
                            }

                            return (
                                <tr className="border-b hover:bg-gray-50" key={index}>
                                    <div className="flex items-center m-2">
                                        <img src={rate.product?.images} className="w-10 h-8 rounded-md" />

                                        <div>
                                            <td className="px-2 py-2 text-sm font-medium text-gray-900">{rate.product?.name}</td>
                                        </div>
                                    </div>

                                    <td className="px-6 py-4 text-sm text-primary text-left">
                                        {starDisplay}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-primary text-left">
                                        <Link to={`/admin/rates/${rate.product?.slug}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div> */}
            <div className="overflow-x-auto mt-4 mb-8">
                <table className="min-w-full table-auto border-collapse bg-white rounded-md">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-4 text-sm font-medium text-gray-900 text-left">Sản phẩm</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-900 text-left">Số sao</th>
                            <th className="px-6 py-4 text-sm font-medium text-gray-900 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productReviews.map((productReview, index) => {
                            const { product, starDisplay } = productReview;

                            return (
                                <tr className="border-b hover:bg-gray-50" key={product?.id}>
                                    <div className="flex items-center m-2">
                                        <img
                                            src={product?.images[0] || "https://via.placeholder.com/40"}
                                            className="w-10 h-8 rounded-md"
                                            alt="Product"
                                        />
                                        <div>
                                            <td className="px-2 py-2 text-sm font-medium text-gray-900">{product?.name}</td>
                                        </div>
                                    </div>

                                    <td className="px-6 py-4 text-sm text-primary text-left">{starDisplay}</td>

                                    <td className="px-6 py-4 text-sm text-primary text-left">
                                        <Link to={`/admin/rates/${product?.slug}`}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="size-6 cursor-pointer"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                />
                                            </svg>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

        </>
    );
};
export default Rates;
