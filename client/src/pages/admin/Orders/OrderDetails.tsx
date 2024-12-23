import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Orders } from "../../../interfaces/IOrders";
import instance from "../../../instance/instance";
import { toast } from "react-toastify";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { ConfigProvider, Select, Steps } from "antd";
import { GiftOutlined, LockOutlined } from "@ant-design/icons";
import { TiDelete } from "react-icons/ti";
import "./index.css";
import { FaCarSide, FaMotorcycle } from "react-icons/fa";
import { GiCardboardBox } from "react-icons/gi";
import { MdUpdate } from "react-icons/md";
import { status } from "../../../components/User/Manager/Orders/UserOrderDetail";
import { checkPaymentMethod } from "../../../components/User/Manager/Orders/ManagerOrdersUser";

const OrderDetails = () => {
  const [customReason, setCustomReason] = useState("");
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [orderDetail, setOrderDetail] = useState<Orders>();
  const [selectedStatus, setSelectedStatus] = useState(
    orderDetail?.status_order || ""
  );
  const { code } = useParams<{ code: string }>();
  const orderStatuses = [
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "preparing_goods", label: "Chuẩn bị hàng" },
    { value: "shipping", label: "Đang vận chuyển" },
    { value: "delivered", label: "Đã giao hàng" },
    { value: "canceled", label: "Hủy" },
  ];

  const stepIndex = orderStatuses.findIndex(
    (status) => status.value === selectedStatus
  );
  const handleCancelOrder = () => {
    // Hiển thị modal khi người dùng nhấn vào nút "Hủy"
    setShowCancelModal(true);
  };
  const handleCloseModal = () => {
    setShowCancelModal(false);
    setCancelReason(""); // Reset lý do hủy
  };
  // const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newStatus = event.target.value;
  //   setSelectedStatus(newStatus);

  //   if (newStatus === "canceled") {
  //     setShowCancelModal(true);
  //   } else {
  //     setShowCancelModal(false);
  //   }
  // };

  const isOptionDisabled = (option: { value: string; label: string }) => {
    // Nếu trạng thái hiện tại là "pending"
    if (selectedStatus === "pending") {
      if (!["confirmed", "canceled"].includes(option.value)) return true;
    }
  
    // Nếu trạng thái hiện tại là "confirmed"
    if (selectedStatus === "confirmed") {
      if (!["preparing_goods", "canceled"].includes(option.value)) return true;
    }
    if (selectedStatus === "preparing_goods") {
      if (option.value !== "shipping") return true;
    }
    if (selectedStatus === "shipping") {
      if (option.value !== "delivered") return true;
    }


    // Nếu trạng thái hiện tại có trước "shipping"
    const orderStatusOrder = [
      "pending",
      "confirmed",
      "preparing_goods",
      "shipping",
      "delivered",
      "canceled",
    ];
    const currentIndex = orderStatusOrder.indexOf(selectedStatus);
    const optionIndex = orderStatusOrder.indexOf(option.value);

    // Disable các trạng thái trước trạng thái hiện tại
    if (optionIndex < currentIndex) return true;

    // Disable "canceled" nếu đang ở trạng thái shipping hoặc delivered
    if (
      option.value === "canceled" &&
      (selectedStatus === "shipping" || selectedStatus === "delivered")
    ) {
      return true;
    }

    return false;
  };
  const handleUpdateStatus = async () => {
    try {
      // Gửi yêu cầu cập nhật trạng thái
      await instance.patch(`admin/order-detail/${code}`, {
        status: selectedStatus,
      });
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      fetchOrderDetail(code as string); // Refresh lại thông tin đơn hàng sau khi cập nhật
      navigate("/admin/orders");
    } catch (error: any) {
      // Log lỗi chi tiết hơn
      console.error("Error updating status:", error);
      console.error("Error response data:", error.response?.data); // Ghi log dữ liệu phản hồi
      console.error("Error status:", error.response?.status); // Ghi log mã trạng thái phản hồi

      // Hiển thị thông báo lỗi cho người dùng
      toast.error(
        `Error updating status: ${
          error.response?.data?.message || "Unknown error"
        }`
      );
    }
  };
  const fetchOrderDetail = async (code: string) => {
    try {
      const { data } = await instance.get(`admin/order-detail/${code}`);
      setOrderDetail(data.data);
      // Đảm bảo rằng bạn set selectedStatus bằng với status_order của đơn hàng
      const currentStatus = data.data.status_order; // Trạng thái hiện tại
      const statusExists = orderStatuses.some(
        (status) => status.value === currentStatus
      );
      setSelectedStatus(statusExists ? currentStatus : "pending"); // Nếu trạng thái không hợp lệ, fallback về "pending"
    } catch (error: any) {
      toast.error(
        `Error fetching order details: ${
          error.response?.data?.message || "Unknown error"
        }`
      );
    }
  };
  const handleCancelClick = () => {
    if (selectedStatus === "shipping" || selectedStatus === "delivered") {
      toast.warning("Không thể hủy đơn hàng trong trạng thái này"); // Thông báo cho người dùng
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
      await instance.patch(`admin/order-cancelation/${code}`, {
        reason: cancelReason,
      });
      toast.success("Hủy đơn hàng thành công!");
      setSelectedStatus("canceled");
      setOrderDetail((prev) =>
        prev ? { ...prev, status_order: "canceled" } : prev
      );
      // Gọi lại fetchOrderDetail để cập nhật thông tin đơn hàng nếu cần
      fetchOrderDetail(code as string);
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      toast.error(
        `Error cancelling order: ${
          error.response?.data?.message || "Unknown error"
        }`
      );
    } finally {
      handleCloseModal(); // Đóng modal sau khi xác nhận hủy
    }
  };
  useEffect(() => {
    if (code) {
      fetchOrderDetail(code); // Gọi hàm với mã đơn hàng
    }
  }, [code]);
  //   const translateStatus = (status: string): string => {
  //     const statusTranslations: { [key: string]: string } = {
  //       pending: "Chờ xác nhận",
  //       confirmed: "Đã xác nhận",
  //       preparing_goods: "Đang chuẩn bị hàng",
  //       shipping: "Đang giao hàng",
  //       delivered: "Đã giao",
  //       canceled: "Đã hủy",
  //     };
  //     return statusTranslations[status] || "Trạng thái không xác định";
  //   };
  const nav = useNavigate();

  const handleBackClick = () => {
    nav("/admin/orders");
  };
  return (
    <div className="flex gap-4">
      <div className="rounded-lg overflow-hidden w-full h-max space-y-4 bg-util py-3 px-5">
        <div className="border-b border-[#f1f1f1] pb-3">
          <h2 className="text-md font-medium text-secondary">
            ĐƠN HÀNG : <span className="text-primary">{orderDetail?.code}</span>
          </h2>
        </div>
        <div className="flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="table w-full overflow-hidden rounded-sm">
              <thead>
                <tr className="text-sm font-[400] bg-[#F3F6F9] h-10 text-secondary/65">
                  <th className="font-medium text-left pl-4">
                    Chi tiết sản phẩm
                  </th>
                  <th className="font-medium">Giá</th>
                  <th className="font-medium">Số lượng</th>
                  <th className="font-medium">Tổng số tiền</th>
                </tr>
              </thead>
              <tbody>
                {orderDetail &&
                  orderDetail.items.map((item, index) => {
                    return (
                      <tr
                        className="text-secondary/75 text-sm border-b border-dashed border-input"
                        key={index + 1}
                      >
                        <td className="py-4">
                          <div className="flex gap-3 w-fit items-center">
                            <img
                              src={
                                item?.variant?.image ||
                                item?.variant?.product?.images[0]
                              }
                              className="w-14 h-14 object-cover rounded-lg"
                            />
                            <div className="space-y-1">
                              <Link
                                to={`/${item?.variant?.product?.category?.slug}/${item?.variant?.product?.slug}`}
                                className="line-clamp-1 text-sm hover:text-primary"
                              >
                                {item?.variant?.product?.name || "N/A"}
                              </Link>
                              <div className="flex gap-2 text-secondary/50 flex-wrap">
                                {item?.variant?.attribute_values.map(
                                  (attribute_value, index) => {
                                    return (
                                      <>
                                        <div className="text-[13px]">
                                          <span>
                                            {attribute_value.attribute.name}
                                          </span>
                                          {": "}
                                          <span>{attribute_value.value}</span>
                                        </div>
                                        {index <
                                          item?.variant?.attribute_values
                                            .length -
                                            1 && (
                                          <span className="text-[13px]">|</span>
                                        )}
                                      </>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          {item.unit_price.toLocaleString()}đ
                        </td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-center">
                          {item.total_price.toLocaleString()}đ
                        </td>
                      </tr>
                    );
                  })}
                <tr className="border-t border-dashed border-input">
                  <td colSpan={1}></td>
                  <td colSpan={3} className="px-4 pt-3.5">
                    <div className="text-sm space-y-3">
                      <p className="font-medium flex justify-between">
                        Tổng tiền:{" "}
                        <span className="block mr-2">
                          {orderDetail?.grand_total.toLocaleString()}đ
                        </span>
                      </p>
                      <p className="font-medium flex justify-between">
                        <span>
                          Giảm giá:{" "}
                          <span className="text-secondary/30">
                            {Number(orderDetail?.coupons.length) >= 1 &&
                              `(${orderDetail?.coupons[0].coupon.code})`}
                          </span>
                        </span>
                        <span className="block mr-2 text-primary">
                          {orderDetail?.coupons.length >= 1
                            ? orderDetail?.coupons[0]?.coupon.discount_type ===
                              "percentage"
                              ? `-${Math.abs(
                                  orderDetail?.coupons[0]?.discount_amount
                                )}%`
                              : `-${Number(
                                  orderDetail?.coupons[0]?.discount_amount
                                ).toLocaleString()}đ`
                            : "0đ"}
                        </span>
                      </p>
                      <p className="border-t border-dashed border-input pt-3 font-medium flex justify-between">
                        Tổng thanh toán:{" "}
                        <span className="block mr-2 text-[#0DD1B7]">
                          {orderDetail?.final_total.toLocaleString()}đ
                        </span>
                      </p>
                      <p
                        className={`${
                          orderDetail?.profit > 0
                            ? "text-[#22A949]"
                            : "text-red-400"
                        }`}
                      >
                        ( <span>Lợi nhuận đơn:</span>{" "}
                        {orderDetail?.profit.toLocaleString()}đ )
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="border border-[#f1f1f1]"></div>
        <div className="flex bg-white py-3 justify-between">
          <div className="bg-white rounded-lg w-full h-max lg:w-2/3 space-y-3">
            <label
              htmlFor="orderStatus"
              className="block text-sm font-medium text-secondary"
            >
              TRẠNG THÁI ĐƠN HÀNG
            </label>
            <div className="flex gap-2">
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#ff9900",
                  },
                }}
              >
                <Select
                  style={{ width: "170px" }}
                  value={selectedStatus}
                  onChange={(value) => {
                    setSelectedStatus(value);
                    if (value === "canceled") {
                      setShowCancelModal(true);
                    }
                  }}
                  disabled={
                    selectedStatus === "canceled"
                  }
                >
                  {orderStatuses.map((status) => (
                    <Select.Option
                      key={status.value}
                      value={status.value}
                      disabled={isOptionDisabled(status)}
                    >
                      {status.label}
                    </Select.Option>
                  ))}
                </Select>
              </ConfigProvider>
              <button
                className="bg-primary/90 text-util px-3 rounded-full text-sm"
                onClick={() => fetchOrderDetail(orderDetail.code)}
              >
                Đặt lại
              </button>
            </div>
          </div>
          {selectedStatus !== "canceled" && (
            <div className="flex items-center gap-3">
              <div className="">
                <button
                  onClick={handleUpdateStatus}
                  type="submit"
                  className="cursor-pointer focus:outline-none w-full text-white bg-primary hover:bg-primary focus:ring-4 focus:ring-primary font-medium rounded-md text-sm py-2 px-3.5 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary flex items-center justify-center"
                >
                  <MdUpdate className="mr-2 w-5 h-5" /> Cập nhật
                </button>
              </div>
              {selectedStatus !== "delivered" && (
                <div>
                  <button
                    type="submit"
                    onClick={handleCancelClick}
                    className="text-[#FF7F40] bg-primary/10 py-1.5 px-2 flex items-center flex-nowrap gap-1 rounded-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-5"
                      color={"currentColor"}
                      fill={"none"}
                    >
                      <path
                        d="M12 22C11.1818 22 10.4002 21.6708 8.83693 21.0123C4.94564 19.3734 3 18.5539 3 17.1754V7.54234M12 22C12.8182 22 13.5998 21.6708 15.1631 21.0123C19.0544 19.3734 21 18.5539 21 17.1754V7.54234M12 22V12.0292M21 7.54234C21 8.15478 20.1984 8.54152 18.5953 9.315L15.6741 10.7244C13.8712 11.5943 12.9697 12.0292 12 12.0292M21 7.54234C21 6.9299 20.1984 6.54316 18.5953 5.76969L17 5M3 7.54234C3 8.15478 3.80157 8.54152 5.40472 9.315L8.32592 10.7244C10.1288 11.5943 11.0303 12.0292 12 12.0292M3 7.54234C3 6.9299 3.80157 6.54317 5.40472 5.76969L7 5M6 13.0263L8 14.0234"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 2L12 4M12 4L14 6M12 4L10 6M12 4L14 2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>Huỷ đơn</span>
                  </button>
                </div>
              )}
            </div>
          )}
          {showCancelModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 overflow-hidden">
              <div className="bg-white p-4 rounded-lg shadow-lg w-1/4 max-h-screen overflow-y-auto text-sm">
                <h3 className="text-md font-semibold mb-3">
                  Lý do hủy đơn hàng
                </h3>
                <div className="space-y-2">
                  {[
                    "Hàng không đúng mẫu",
                    "Giao hàng chậm quá số ngày quy định",
                    "Sai chính sách",
                    "Khác",
                  ].map((reason, idx) => (
                    <label key={idx} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value={reason}
                        checked={cancelReason === reason}
                        onChange={() => setCancelReason(reason)}
                        className={`h-4 w-4 ${
                          cancelReason === reason
                            ? "text-primary"
                            : "text-blue-600"
                        } appearance-none border border-gray-300 rounded-full checked:bg-primary checked:border-transparent focus:outline-none`}
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
        <div className="bg-white space-y-2">
          <h3 className="font-medium uppercase flex gap-5 text-sm items-center">
            Trạng thái đơn hàng : {status(orderDetail?.status_order!)}
          </h3>
          <Steps current={stepIndex} direction="vertical">
            {orderStatuses.map((status, index) => (
              <Steps.Step
                key={status.value}
                title={status.label}
                description={
                  index === 0
                    ? "Đơn hàng đã được tiếp nhận và đang chờ xác nhận từ hệ thống."
                    : index === 1
                    ? "Đơn hàng đã được xác nhận. Hãy tiến hành chuẩn bị hàng hóa."
                    : index === 2
                    ? "Đơn hàng đang trong quá trình chuẩn bị để chuyển đến kho vận chuyển."
                    : index === 3
                    ? "Đơn hàng đã được giao cho đơn vị vận chuyển và đang trên đường đến khách hàng."
                    : index === 4
                    ? "Đơn hàng đã được giao thành công đến khách hàng. Quy trình xử lý hoàn tất."
                    : index === 5
                    ? "Đơn hàng đã bị hủy theo yêu cầu của khách hàng hoặc do quy định."
                    : ""
                }
                icon={
                  <span
                    className={`flex items-center justify-center w-8 h-8 border-2 rounded-full ${
                      selectedStatus === "canceled" && index === 5 // Nếu trạng thái là "canceled" và là bước hủy
                        ? "bg-primary text-white"
                        : selectedStatus === "canceled" // Nếu trạng thái là "canceled" cho tất cả các bước
                        ? "bg-gray-400 text-white"
                        : index === stepIndex
                        ? "bg-primary text-white"
                        : index < stepIndex
                        ? "bg-primary text-white"
                        : selectedStatus === "pending" && index > stepIndex
                        ? "bg-gray-400 text-white"
                        : selectedStatus === "confirmed" && index > stepIndex
                        ? "bg-gray-400 text-white"
                        : selectedStatus === "preparing_goods" &&
                          index > stepIndex
                        ? "bg-gray-400 text-white"
                        : selectedStatus === "shipping" &&
                          (status.value === "delivered" ||
                            status.value === "canceled")
                        ? "bg-gray-400 text-white"
                        : "bg-gray-200 text-gray-700"
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
      <div className="overflow-hidden w-full lg:w-1/3 space-y-4">
        <div className="border border-[#f1f1f1] rounded-md bg-util p-3 space-y-2">
          <h3 className="uppercase text-primary font-medium text-sm flex items-center gap-2 pb-2.5 border-b border-input/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
              color={"#ff9900"}
              fill={"none"}
            >
              <path
                d="M5.08069 15.2964C3.86241 16.0335 0.668175 17.5386 2.61368 19.422C3.56404 20.342 4.62251 21 5.95325 21H13.5468C14.8775 21 15.936 20.342 16.8863 19.422C18.8318 17.5386 15.6376 16.0335 14.4193 15.2964C11.5625 13.5679 7.93752 13.5679 5.08069 15.2964Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M17 5L22 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 8L22 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 11L22 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Thông tin nhận hàng
          </h3>
          <div className="space-y-2">
            <p>
              <label htmlFor="full-name" className="text-sm font-medium">
                Họ và tên:{" "}
                <span className="font-normal">{orderDetail?.name}</span>
              </label>
            </p>
            <p>
              <label htmlFor="email" className="text-sm font-medium">
                Email:{" "}
                <span className="font-normal">{orderDetail?.user.email}</span>
              </label>
            </p>
            <p>
              <label htmlFor="phone" className="text-sm font-medium">
                Số điện thoại:{" "}
                <span className="font-normal">{orderDetail?.tel}</span>
              </label>
            </p>
          </div>
        </div>
        <div className="border border-[#f1f1f1] rounded-md bg-util p-3 space-y-2">
          <h3 className="uppercase text-primary font-medium text-sm flex items-center gap-2 pb-2.5 border-b border-input/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
              color={"#ff9900"}
              fill={"none"}
            >
              <path
                d="M18.9108 18C19.8247 19.368 20.2113 20.203 19.8865 20.8999C19.8466 20.9854 19.7999 21.0679 19.7469 21.1467C19.1724 22 17.6875 22 14.7178 22H9.28223C6.31251 22 4.82765 22 4.25311 21.1467C4.20005 21.0679 4.15339 20.9854 4.11355 20.8999C3.78869 20.203 4.17527 19.368 5.08915 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 9.5C15 11.1569 13.6569 12.5 12 12.5C10.3431 12.5 9 11.1569 9 9.5C9 7.84315 10.3431 6.5 12 6.5C13.6569 6.5 15 7.84315 15 9.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12 2C16.0588 2 19.5 5.42803 19.5 9.5869C19.5 13.812 16.0028 16.777 12.7725 18.7932C12.5371 18.9287 12.2709 19 12 19C11.7291 19 11.4629 18.9287 11.2275 18.7932C8.00325 16.7573 4.5 13.8266 4.5 9.5869C4.5 5.42803 7.9412 2 12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            Địa chỉ nhận hàng
          </h3>
          <p>
            <label htmlFor="full-name" className="text-sm font-medium">
              <span className="font-normal">{orderDetail?.address}</span>
            </label>
          </p>
        </div>
        <div className="border border-[#f1f1f1] rounded-md bg-util p-3 space-y-5 min-h-[100px]">
          <h3 className="uppercase text-primary font-medium text-sm flex items-center gap-2 pb-2.5 border-b border-input/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
              color={"#ff9900"}
              fill={"none"}
            >
              <path
                d="M3.3457 16.1976L16.1747 3.36866M18.6316 11.0556L16.4321 13.2551M14.5549 15.1099L13.5762 16.0886"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M3.17467 16.1411C1.60844 14.5749 1.60844 12.0355 3.17467 10.4693L10.4693 3.17467C12.0355 1.60844 14.5749 1.60844 16.1411 3.17467L20.8253 7.85891C22.3916 9.42514 22.3916 11.9645 20.8253 13.5307L13.5307 20.8253C11.9645 22.3916 9.42514 22.3916 7.85891 20.8253L3.17467 16.1411Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M4 22H20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Phương thức thanh toán
          </h3>
          <div className="mx-auto w-fit">
            {checkPaymentMethod(String(orderDetail?.payment_method))}
          </div>
        </div>
        <div className="w-full flex justify-center items-center">
          <button
            onClick={handleBackClick}
            className="bg-primary text-white rounded-md flex justify-center items-center gap-2 space-x-4 px-4 py-2"
          >
            <IoArrowBackCircleSharp />
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};
export default OrderDetails;
