import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Orders } from "../../../interfaces/IOrders";
import instance from "../../../instance/instance";
import { toast } from "react-toastify";
import { notification } from "antd";
import { Steps } from 'antd';
import { GiftOutlined, LockOutlined } from '@ant-design/icons';
import { TiDelete } from "react-icons/ti";
import "./index.css"
import { FaCarSide, FaMotorcycle } from "react-icons/fa";
import { GiCardboardBox } from "react-icons/gi";
import { MdUpdate } from "react-icons/md";
import { MdCancel } from "react-icons/md"
import { FaUserCheck } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import VNPAY from "./vnpay1.png"

const OrderDetails = () => {
    const [customReason, setCustomReason] = useState("");
    const navigate = useNavigate();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [orderDetail, setOrderDetail] = useState<Orders>();
    const [selectedStatus, setSelectedStatus] = useState(orderDetail?.status_order || '');
    const { code } = useParams<{ code: string }>();
    const orderStatuses = [
        { value: "pending", label: "Chờ xác nhận" },
        { value: "confirmed", label: "Đã xác nhận" },
        { value: "preparing_goods", label: "Chuẩn bị hàng" },
        { value: "shipping", label: "Đang giao hàng" },
        { value: "delivered", label: "Đã giao hàng" },
        { value: "canceled", label: "Hủy" },
    ];
    const stepIndex = orderStatuses.findIndex(status => status.value === selectedStatus);
    const handleCancelOrder = () => {
        // Hiển thị modal khi người dùng nhấn vào nút "Hủy"
        setShowCancelModal(true);
    };
    const handleCloseModal = () => {
        setShowCancelModal(false);
        setCancelReason(''); // Reset lý do hủy
    };
    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        setSelectedStatus(newStatus); // Lưu trạng thái đã chọn
        if (newStatus === "canceled") {
            setShowCancelModal(true); // Hiện modal lý do hủy
        } else {
            setShowCancelModal(false); // Ẩn modal nếu không phải "Canceled"
        }
        // setSelectedStatus(event.target.value);
    };
    console.log(selectedStatus)

    const handleUpdateStatus = async () => {
        try {
            // Gửi yêu cầu cập nhật trạng thái
            await instance.patch(`admin/order-detail/${code}`, { status: selectedStatus });
            toast.success("Cập nhật trạng thái đơn hàng thành công!");
            fetchOrderDetail(code as string); // Refresh lại thông tin đơn hàng sau khi cập nhật
            navigate("/admin/orders")
        } catch (error: any) {
            // Log lỗi chi tiết hơn
            console.error("Error updating status:", error);
            console.error("Error response data:", error.response?.data); // Ghi log dữ liệu phản hồi
            console.error("Error status:", error.response?.status); // Ghi log mã trạng thái phản hồi

            // Hiển thị thông báo lỗi cho người dùng
            toast.error(`Error updating status: ${error.response?.data?.message || "Unknown error"}`);
        }
    };
    const fetchOrderDetail = async (code: string) => {
        try {
            const { data } = await instance.get(`admin/order-detail/${code}`);
            setOrderDetail(data.data);
            console.log("data:", data.data)
            // Đảm bảo rằng bạn set selectedStatus bằng với status_order của đơn hàng
            const currentStatus = data.data.status_order; // Trạng thái hiện tại
            const statusExists = orderStatuses.some(status => status.value === currentStatus);

            setSelectedStatus(statusExists ? currentStatus : "pending"); // Nếu trạng thái không hợp lệ, fallback về "pending"
        } catch (error: any) {
            toast.error(`Error fetching order details: ${error.response?.data?.message || "Unknown error"}`);
        }
    };
    const handleCancelClick = () => {
        if (selectedStatus === "shipping" || selectedStatus === "delivered") {
            notification.warning({ message: "Không thể hủy đơn hàng khi đang ở trạng thái này" }); // Thông báo cho người dùng
        } else {
            handleCancelOrder(); // Thực hiện hủy đơn hàng nếu trạng thái không phải đang giao
        }
    };
    const handleConfirmCancel = async () => {
        if (!cancelReason) {
            toast.warning("Vui lòng chọn lý do hủy đơn hàng.");
            return;
        }
        try {
            // Gửi yêu cầu hủy đơn hàng với lý do hủy
            await instance.patch(`admin/order-cancelation/${code}`, { reason: cancelReason });
            console.log("reason")
            toast.success("Hủy đơn hàng thành công!");
            setSelectedStatus("canceled");
            setOrderDetail((prev) => prev ? { ...prev, status_order: "canceled" } : prev);
            // Gọi lại fetchOrderDetail để cập nhật thông tin đơn hàng nếu cần
            fetchOrderDetail(code as string);
        } catch (error: any) {
            console.error("Error cancelling order:", error);
            toast.error(`Error cancelling order: ${error.response?.data?.message || "Unknown error"}`);
        } finally {
            handleCloseModal(); // Đóng modal sau khi xác nhận hủy
        }
    };
    useEffect(() => {
        if (code) {
            fetchOrderDetail(code); // Gọi hàm với mã đơn hàng
        }
    }, [code])
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


    return (
        <div className="flex">
            <div className=" shadow-md rounded-lg overflow-hidden w-full h-max lg:w-2/3 mr-4">
                <div className="bg-primary px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Chi tiết đơn hàng : {orderDetail?.code}</h2>
                </div>
                <div className="flex flex-col">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full bg-white">
                            <thead className="bg-secondary-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">STT</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Sản phẩm</th>
                                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Ảnh sản phẩm</th> */}
                                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Màu</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Size</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Loại vải</th> */}
                                    <th className="px-4 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Số lượng</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Đơn giá</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-secondary-600 uppercase tracking-wider border-b">Tổng</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td colSpan={6} className="p-0">
                                        <hr className="border-secondary-300" />
                                    </td>
                                </tr>
                            </tbody>
                            <tbody className="divide-y divide-secondary-200">
                                {orderDetail?.items?.map((item, index) => {
                                    console.log("item", item?.variant?.attribute_values)
                                    // console.log("name:")

                                    return (
                                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-primary text-center">{index + 1}</td>

                                            {/* Tên sản phẩm */}
                                            <td className="px-4 py-3 text-sm font-medium break-words text-primary flex items-center space-x-4">
                                                <div>
                                                    <img
                                                        src={
                                                            item?.variant?.image ||
                                                            (item?.variant?.product?.images
                                                                ? JSON.parse(item.variant.product.images)[0]
                                                                : '/default-image.png')
                                                        }
                                                        alt={item?.variant?.product?.name || 'Product Image'}
                                                        className="w-16 h-16 object-cover rounded-md border border-gray-300"
                                                    />
                                                </div>


                                                <div className="space-y-2">
                                                    <div>
                                                        {item?.variant?.product?.name || 'N/A'}
                                                    </div>
                                                    <div className="text-uppercase flex gap-3">
                                                        {item?.variant?.attribute_values.map((i) => {
                                                            return (
                                                                <td className="text-gray-400 text-uppercase whitespace-nowrap text-sm text-left">
                                                                    <span className="">
                                                                        {i.attribute?.name}
                                                                    </span>{" "}
                                                                    : <span>{i.value}</span>
                                                                </td>
                                                            )
                                                        })}

                                                    </div>
                                                </div>

                                            </td>

                                            {/* Số lượng */}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-b text-center">
                                                {item?.quantity || 0}
                                            </td>

                                            {/* Giá */}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-primary text-center">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.variant?.price || 0)}
                                            </td>

                                            {/* Tổng giá */}
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-primary text-center">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.total_price || 0)}
                                            </td>
                                        </tr>
                                    )
                                }
                                )}

                                {/* <tr>
                                    <td colSpan="5" className="px-4 py-4  text-right text-sm font-semibold text-secondary-900">Voucher giảm giá:</td>
                                    <td className="px-4 py-4 whitespace-nowrap  text-sm font-semibold text-secondary-900">500,000 VND</td>
                                </tr> */}
                                <tr className="border-none">
                                    <td colSpan="4" className="px-4 py-2 text-black text-right text-sm font-semibold text-secondary-900">
                                        Tổng phụ:
                                    </td>
                                    <td className="px-4  whitespace-nowrap text-gray-500 text-sm font-semibold text-secondary-900">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(orderDetail?.grand_total || 0)}
                                    </td>
                                </tr>

                                <tr className="border-none">
                                    {orderDetail?.coupons?.map((value) => {
                                        return (
                                            <>
                                                <td colSpan="4" className="px-4 py-2 text-black text-right text-sm font-semibold text-secondary-900">
                                                    Giảm giá (
                                                    <span className="text-primary">{value.coupon?.code}</span>
                                                    ):
                                                </td>

                                                <td className="px-4 whitespace-nowrap text-primary text-sm font-semibold text-secondary-900">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(value.discount_amount)}
                                                </td>
                                            </>
                                        )
                                    })}

                                </tr>
                                <tr className="border-none">
                                    <td colSpan="4" className="px-4 py-2 text-black text-right text-sm font-semibold text-secondary-900">
                                        Thuế:
                                    </td>
                                    <td className="px-4  whitespace-nowrap text-gray-400 text-sm font-semibold text-secondary-900">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(0)}
                                    </td>
                                </tr>

                                <tr className="border-none">
                                    <td colSpan="4" className="px-4 py-2 text-black text-right text-sm font-semibold text-secondary-900">
                                        Tổng thanh toán:
                                    </td>
                                    <td className="px-4 whitespace-nowrap text-green-500 text-sm font-semibold text-secondary-900">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(orderDetail?.final_total || 0)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="4"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex bg-white">
                    <div className="mb-6 bg-white rounded-lg w-full h-max lg:w-2/3 mr-4">
                        <label htmlFor="orderStatus" className="block text-sm font-medium text-primary px-4 py-4">
                            Cập nhật trạng thái đơn hàng
                        </label>
                        <select
                            id="orderStatus"
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            disabled={selectedStatus === "canceled"}
                            className="mt-1 block mx-4 border-gray-300 rounded-md min-w-max shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        >
                            {orderStatuses
                                .filter((status) => !(
                                    (selectedStatus === "shipping" || selectedStatus === "delivered") && status.value === "canceled"))
                                .map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                        </select>
                    </div>
                    {selectedStatus !== "canceled" && (
                        <>
                            <div className="">
                                <button
                                    onClick={handleUpdateStatus}
                                    type="submit"
                                    className="cursor-pointer focus:outline-none mx-10 my-12 w-full text-white bg-primary hover:bg-primary focus:ring-4 focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary flex items-center justify-center"
                                >
                                    <MdUpdate className="mr-2 w-5 h-5" /> {/* Biểu tượng update với khoảng cách bên phải */}
                                    Cập nhật
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={handleCancelClick}
                                    type="submit"
                                    className="cursor-pointer focus:outline-none my-12 mx-12 text-orange-500 bg-orange-300 hover:bg-orange-200  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary flex items-center justify-center"
                                >
                                    <MdCancel className="mr-2 w-5 h-5" /> {/* Thêm biểu tượng cancel */}
                                    Hủy
                                </button>
                            </div>
                        </>
                    )}
                    {showCancelModal && (
                        // <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 overflow-hidden">
                        //     <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-screen overflow-y-auto">
                        //         <h3 className="text-lg font-semibold mb-4">Lý do hủy đơn hàng</h3>
                        //         <div className="space-y-2">
                        //             {["Hàng không đúng mẫu", "Giao hàng chậm quá số ngày quy định", "Sai chính sách"].map((reason, idx) => (
                        //                 <button
                        //                     key={idx}
                        //                     className={`w-full p-2 border border-gray-300 rounded-md text-left ${cancelReason === reason ? "bg-gray-200" : ""
                        //                         }`}
                        //                     onClick={() => setCancelReason(reason)}
                        //                 >
                        //                     {reason}
                        //                 </button>
                        //             ))}
                        //         </div>
                        //         <div className="flex justify-end mt-4">
                        //             <button
                        //                 onClick={handleCloseModal}
                        //                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2"
                        //             >
                        //                 Đóng
                        //             </button>
                        //             <button
                        //                 onClick={handleConfirmCancel}
                        //                 className="px-4 py-2 bg-red-600 text-white rounded-md"
                        //             >
                        //                 Xác nhận hủy
                        //             </button>
                        //         </div>
                        //     </div>
                        // </div>
                        // <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 overflow-hidden">
                        //     <div className="bg-white p-4 rounded-lg shadow-lg w-1/4 max-h-screen overflow-y-auto text-sm">
                        //         <h3 className="text-md font-semibold mb-3">Lý do hủy đơn hàng</h3>
                        //         <div className="space-y-2">
                        //             {["Hàng không đúng mẫu", "Giao hàng chậm quá số ngày quy định", "Sai chính sách", "Khác"].map((reason, idx) => (
                        //                 <label key={idx} className="flex items-center space-x-2">
                        //                     <input
                        //                         type="radio"
                        //                         value={reason}
                        //                         checked={cancelReason === reason}
                        //                         onChange={() => setCancelReason(reason)}
                        //                         className="form-radio h-4 w-4 text-blue-600"
                        //                     />
                        //                     <span className="text-left">{reason}</span>
                        //                 </label>
                        //             ))}
                        //             {cancelReason === "Khác" && (
                        //                 <input
                        //                     type="text"
                        //                     placeholder="Nhập lý do hủy khác..."
                        //                     value={customReason}
                        //                     onChange={(e) => setCustomReason(e.target.value)}
                        //                     className="mt-2 p-1 border border-gray-300 rounded-md w-full text-sm"
                        //                 />
                        //             )}
                        //         </div>
                        //         <div className="flex justify-end mt-3">
                        //             <button
                        //                 onClick={handleCloseModal}
                        //                 className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md mr-2 text-sm"
                        //             >
                        //                 Đóng
                        //             </button>
                        //             <button
                        //                 onClick={handleConfirmCancel}
                        //                 className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                        //             >
                        //                 Xác nhận hủy
                        //             </button>
                        //         </div>
                        //     </div>
                        // </div>
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 overflow-hidden">
                            <div className="bg-white p-4 rounded-lg shadow-lg w-1/4 max-h-screen overflow-y-auto text-sm">
                                <h3 className="text-md font-semibold mb-3">Lý do hủy đơn hàng</h3>
                                <div className="space-y-2">
                                    {["Hàng không đúng mẫu", "Giao hàng chậm quá số ngày quy định", "Sai chính sách", "Khác"].map((reason, idx) => (
                                        <label key={idx} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                value={reason}
                                                checked={cancelReason === reason}
                                                onChange={() => setCancelReason(reason)}
                                                className={`h-4 w-4 ${cancelReason === reason ? 'text-primary' : 'text-blue-600'} appearance-none border border-gray-300 rounded-full checked:bg-primary checked:border-transparent focus:outline-none`}
                                            />
                                            <span className="text-left">{reason}</span>
                                        </label>
                                    ))}
                                    {cancelReason === "Khác" && (
                                        <input
                                            type="text"
                                            placeholder="Nhập lý do hủy khác..."
                                            value={customReason}
                                            onChange={(e) => setCustomReason(e.target.value)}
                                            className="mt-2 p-1 border border-gray-300 rounded-md w-full text-sm"
                                        />
                                    )}
                                </div>
                                <div className="flex justify-end mt-3">
                                    <button
                                        onClick={handleCloseModal}
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md mr-2 text-sm"
                                    >
                                        Đóng
                                    </button>
                                    <button
                                        onClick={handleConfirmCancel}
                                        className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                                    >
                                        Xác nhận hủy
                                    </button>
                                </div>
                            </div>
                        </div>





                    )}
                </div>
                <div className="bg-white p-8 mt-4">
                    <h3 className="font-bold uppercase">
                        Trạng thái đơn hàng :
                        <span
                            className={`pl-2 font-medium ${orderDetail?.status_order === 'canceled' ? 'text-red-500' :
                                orderDetail?.status_order === 'delivered' ? 'text-green-500' :
                                    orderDetail?.status_order === 'pending' ? 'text-yellow-500' :
                                        orderDetail?.status_order === 'shipping' ? 'text-primary' :
                                            orderDetail?.status_order === 'preparing_goods' ? 'text-yellow-500' :
                                                orderDetail?.status_order === 'confirmed' ? 'text-blue-500' :
                                                    'text-black'
                                }`}
                        >
                            {translateStatus(orderDetail?.status_order)}
                        </span>
                    </h3>
                    <Steps
                        current={stepIndex}
                        direction="vertical"
                    >
                        {orderStatuses.map((status, index) => (
                            <Steps.Step
                                key={status.value}
                                title={status.label}
                                description={
                                    index === 0 ? "Đơn hàng đã được tiếp nhận và đang chờ xác nhận từ hệ thống." :
                                        index === 1 ? "Đơn hàng đã được xác nhận. Hãy tiến hành chuẩn bị hàng hóa." :
                                            index === 2 ? "Đơn hàng đang trong quá trình chuẩn bị để chuyển đến kho vận chuyển." :
                                                index === 3 ? "Đơn hàng đã được giao cho đơn vị vận chuyển và đang trên đường đến khách hàng." :
                                                    index === 4 ? "Đơn hàng đã được giao thành công đến khách hàng. Quy trình xử lý hoàn tất." :
                                                        index === 5 ? "Đơn hàng đã bị hủy theo yêu cầu của khách hàng hoặc do quy định." :
                                                            ""
                                }
                                icon={
                                    <span
                                        className={`flex items-center justify-center w-8 h-8 border-2 rounded-full ${selectedStatus === "canceled" && index === 5 // Nếu trạng thái là "canceled" và là bước hủy
                                            ? 'bg-primary text-white'
                                            : selectedStatus === "canceled" // Nếu trạng thái là "canceled" cho tất cả các bước
                                                ? 'bg-gray-400 text-white'
                                                : index === stepIndex
                                                    ? 'bg-primary text-white'
                                                    : index < stepIndex
                                                        ? 'bg-primary text-white'
                                                        : selectedStatus === "pending" && index > stepIndex
                                                            ? 'bg-gray-400 text-white'
                                                            : selectedStatus === "confirmed" && index > stepIndex
                                                                ? 'bg-gray-400 text-white'
                                                                : selectedStatus === "preparing_goods" && index > stepIndex
                                                                    ? 'bg-gray-400 text-white'
                                                                    : selectedStatus === "shipping" && (status.value === "delivered" || status.value === "canceled")
                                                                        ? 'bg-gray-400 text-white'
                                                                        : 'bg-gray-200 text-gray-700'
                                            }`}
                                    >
                                        {index === 0 && <LockOutlined className="w-4" />}
                                        {index === 1 && <GiftOutlined className="w-4" />}
                                        {index === 2 && <FaCarSide className="w-4" />}
                                        {index === 3 && <FaMotorcycle className="w-4" />}
                                        {index === 4 && <GiCardboardBox className="w-4" />}
                                        {index === 5 && <TiDelete className="w-4" />}
                                    </span>
                                }
                            />
                        ))}
                    </Steps>
                </div>
            </div>
            <div className="overflow-hidden w-full lg:w-1/3 space-y-8">
                <div className="bg-white rounded-lg  p-6">
                    <div className="pb-3 flex justify-between items-center space-x-1">
                        <div className="flex justify-start items-center">
                            <MdLocalShipping className="text-primary w-10" size={20} />
                            <h2 className="text-primary font-bold text-sm">THÔNG TIN HẬU CẦN</h2>
                        </div>
                        <div className="font-mono text-xs w-fit p-2 bg-yellow-100 text-yellow-400 rounded-lg">
                            Track Order
                        </div>
                    </div>
                    <hr />
                    <div className="flex justify-center items-center">
                        <svg
                            className="text-primary w-24"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="150"
                            height="150"
                            color="#000000"
                            fill="none">
                            <path d="M19.5 17.5C19.5 18.8807 18.3807 20 17 20C15.6193 20 14.5 18.8807 14.5 17.5C14.5 16.1193 15.6193 15 17 15C18.3807 15 19.5 16.1193 19.5 17.5Z"
                                stroke="currentColor"
                                stroke-width="1.5" />
                            <path d="M9.5 17.5C9.5 18.8807 8.38071 20 7 20C5.61929 20 4.5 18.8807 4.5 17.5C4.5 16.1193 5.61929 15 7 15C8.38071 15 9.5 16.1193 9.5 17.5Z"
                                stroke="currentColor"
                                stroke-width="1.5" />
                            <path d="M14.5 17.5H9.5M19.5 17.5H20.2632C20.4831 17.5 20.5931 17.5 20.6855 17.4885C21.3669 17.4036 21.9036 16.8669 21.9885 16.1855C22 16.0931 22 15.9831 22 15.7632V13C22 9.41015 19.0899 6.5 15.5 6.5M15 15.5V7C15 5.58579 15 4.87868 14.5607 4.43934C14.1213 4 13.4142 4 12 4H5C3.58579 4 2.87868 4 2.43934 4.43934C2 4.87868 2 5.58579 2 7V15C2 15.9346 2 16.4019 2.20096 16.75C2.33261 16.978 2.52197 17.1674 2.75 17.299C3.09808 17.5 3.56538 17.5 4.5 17.5"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M6.5 7V10.9998M10.5 7V10.9998"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div className="space-y-3">
                        <div className="flex space-x-2">
                            <p className="font-bold text-sm">Ngày đặt hàng :</p>
                            <span className="text-sm">
                                {new Date(orderDetail?.created_at).toLocaleDateString("vi-VN", {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            <p className="font-bold text-sm">Phương thức giao hàng :</p>
                            <span className="text-sm">
                                Giao hàng nhanh
                            </span>
                        </div>

                        <div className="">
                            <div className="flex space-x-2">
                                <p className="font-bold text-sm">Phương thức thanh toán :</p>
                                <span className="text-sm">
                                    {orderDetail?.payment_method}
                                </span>
                            </div>

                            {orderDetail?.payment_method === 'VNPAY' && (
                                <img src={VNPAY} className="w-16 h-7" />
                            )}
                            {orderDetail?.payment_method === 'COD' && (
                                <span className="text-green-600 text-sm">Thanh toán khi nhận hàng (COD)</span>
                            )}
                        </div>
                        <div className="space-x-2">
                            <p className="font-bold text-sm">Ghi chú đơn hàng :</p>
                            <span className="text-sm">
                                {orderDetail?.notes}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg  p-6">
                    <div className="pb-3 flex justify-start items-center space-x-1">
                        <FaUserCheck className="text-primary w-10" />
                        <h2 className="text-primary font-bold text-sm">THÔNG TIN NHẬN HÀNG</h2>
                    </div>
                    <hr />
                    <div className="pt-4 space-y-3">
                        <div className="flex space-x-2">
                            <p className="font-bold text-sm">Họ và tên :</p>
                            <span className="text-sm">
                                {orderDetail?.name}
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            <p className="font-bold text-sm">Email :</p>
                            <span className="text-sm">
                                {orderDetail?.user?.email}
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            <p className="font-bold text-sm">Số điện thoại :</p>
                            <span className="text-sm">
                                {orderDetail?.tel}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6">
                    <div className="pb-2 flex justify-start items-center space-x-1">
                        <FaAddressBook className="text-primary w-10" />
                        <h2 className="text-primary font-bold text-sm">ĐỊA CHỈ NHẬN HÀNG</h2>
                    </div>
                    <hr />
                    <div className="pt-3 space-y-2">
                        <div className="">
                            <span className="font-bold text-sm">Địa chỉ nhận hàng:</span><br />
                            <span className="text-sm">
                                {orderDetail?.address}
                            </span>
                        </div>
                        <div className="">
                            <span className="font-bold text-sm">Địa chỉ thanh toán:</span><br />
                            <span className="text-sm">
                                {orderDetail?.address}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default OrderDetails