import axios from "axios";
import { toast } from "react-toastify";
import instance from "../../../instance/instance";
import { useContext, useEffect, useState } from "react";
import CartContext from "../../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Modal, Input, Progress, message } from "antd";
import { IVoucher } from "../../../interfaces/IVouchers";
import queryString from "query-string";
import { useRef } from "react";
type Prop = {
  current: number;
};

const ConfirmOrder = ({ current }: Prop) => {
  const { dispatch } = useContext(CartContext);
  const final_total = JSON.parse(localStorage.getItem("final_total") || "0");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voucherCarts, setVoucherCarts] = useState<IVoucher[]>([]);
  const [valueSearch, setChangeValueSearch] = useState<string>("");
  const [selectVoucher, setSelectVoucher] = useState<string>("");
  const [voucherCheck, setCheckVoucher] = useState<IVoucher | undefined>(
    undefined
  );
  const callbackProcessedRef = useRef(false);
  const parsed = queryString.parse(location.search);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const vnp_ResponseCode = parsed?.vnp_ResponseCode;
        const vnp_TransactionStatus = parsed?.vnp_TransactionStatus;

        // Kiểm tra xem callback đã được xử lý chưa
        const isCallbackProcessed = localStorage.getItem("vnpay_callback_processed");
        const savedVoucher = JSON.parse(localStorage.getItem('selected_voucher') || 'null');
        const finalPaymentAmountVnpay = savedVoucher
        ? final_total - savedVoucher.discount
        : final_total;
        if (vnp_ResponseCode && !isCallbackProcessed && !callbackProcessedRef.current) {
          localStorage.setItem("vnpay_callback_processed", "true");
          callbackProcessedRef.current = true;

          const orderDataRaw = localStorage.getItem("orderData");
          const parsedOrderData = JSON.parse(orderDataRaw!);

          const { data } = await instance.post("vnpay/callback", {
            coupon_id: savedVoucher?.id,
            discount_amount: savedVoucher?.discount,
            ...parsed,
          });
          console.log(data)
          if (
            vnp_ResponseCode === "00" &&
            vnp_TransactionStatus === "00" &&
            String(data.status) === "success"
          ) {
            message.success("Thanh toán thành công!");
            const checkoutData = await instance.post("checkout-vnpay", {
              name: parsedOrderData.fullName,
              tel: parsedOrderData.phone,
              coupon_id: savedVoucher?.id,
              discount_amount: savedVoucher?.discount,
              final_total: finalPaymentAmountVnpay,
              ...parsedOrderData,
            });

            if (checkoutData) {
              const id_carts = JSON.parse(localStorage.getItem("id_cart") || "[]");
              dispatch({
                type: "REMOVE_SELECTED",
                payload: id_carts,
              });
              toast.success(checkoutData.data.message);
              navigate("/user-manager/user-orders");
              ["id_cart", "orderData", "final_total","vnpay_callback_processed","selected_voucher"].forEach((key) =>
                localStorage.removeItem(key)
              );
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      callbackProcessedRef.current = false;
    };
  }, []);

  const finalPaymentAmount = voucherCheck
    ? final_total - voucherCheck.discount
    : final_total;

  const { Search } = Input;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const submitOrder = async () => {
    try {
      const orderDataRaw = localStorage.getItem("orderData");
      const parsedOrderData = JSON.parse(orderDataRaw!);
      if (parsedOrderData?.payment_method === "COD") {
        const { data } = await instance.post("checkout", {
          name: parsedOrderData.fullName,
          tel: parsedOrderData.phone,
          coupon_id: voucherCheck?.id,
          discount_amount: voucherCheck?.discount,
          final_total: finalPaymentAmount,
          ...parsedOrderData,
        });

        if (data) {
          const id_carts = JSON.parse(localStorage.getItem("id_cart") || "[]");
          dispatch({
            type: "REMOVE_SELECTED",
            payload: id_carts,
          });
          toast.success(data.message);
          navigate("/user-manager/user-orders");
          ["id_cart", "orderData", "final_total","selected_voucher"].forEach((key) =>
            localStorage.removeItem(key)
          );
        }
      }
      if (parsedOrderData?.payment_method === "VNPAY") {
        const { data } = await instance.post("checkout", {
          name: parsedOrderData.fullName,
          tel: parsedOrderData.phone,
          coupon_id: voucherCheck?.id,
          discount_amount: voucherCheck?.discount,
          final_total: finalPaymentAmount,
          ...parsedOrderData,
        });

        if (data) {
          console.log(data);
          window.location.assign(data.paymentUrl);
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Đã xảy ra lỗi không mong muốn");
      }
    }
  };

  useEffect(() => {
    const fetchVoucherCarts = async () => {
      try {
        const {
          data: { data: response },
        } = await instance.post("coupon-cart", {
          totalCart: final_total,
        });

        if (response) {
          setVoucherCarts(response);
        }
        setCheckVoucher(undefined);
        if (isModalOpen) {
          setSelectVoucher("");
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        message.error("Không thể tải danh sách voucher");
      }
    };

    fetchVoucherCarts();
  }, [isModalOpen, final_total]);

  const changeValueSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeValueSearch(e.target.value);
  };

  const handleSelectVoucher = (code: string) => {
    setSelectVoucher(code);
  };

  const handleCheckVoucher = () => {
    const validVoucher = voucherCarts.find(
      (voucherCart) => voucherCart.code === selectVoucher
    );
    if (validVoucher) {
      setCheckVoucher(validVoucher);
      localStorage.setItem('selected_voucher', JSON.stringify(validVoucher));
      message.success("Mã giảm giá đã được áp dụng");
    } else {
      message.warning("Mã voucher không hợp lệ!");
    }
  };

  return (
    <div className="col-span-3 border border-input p-3 rounded-md h-fit space-y-6 sticky top-20 bg-util">
      <Modal
        title="Chọn Yoony Voucher"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="Quay lại"
      >
        <form action="" className="p-5 bg-primary/20 rounded-md my-5">
          <Search
            placeholder="Nhập mã khuyến mãi"
            allowClear
            size="large"
            onChange={changeValueSearch}
            enterButton="Tìm kiếm"
          />
        </form>
        <div className="space-y-5 max-h-[400px] overflow-y-auto pr-0.5 py-1">
          {voucherCarts &&
            voucherCarts
              .filter((item) => {
                return item.code.includes(valueSearch.toUpperCase());
              })
              .map((voucherCart) => {
                return (
                  <div
                    className="flex gap-5 overflow-hidden rounded-sm box-shaw-voucher-cart"
                    key={voucherCart.id}
                  >
                    <div className="p-6 w-full max-w-[115px] bg-primary text-util relative flex flex-col items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="size-9"
                        color={"currentColor"}
                        fill={"none"}
                      >
                        <path
                          d="M12 22C16.4183 22 20 18.4183 20 14C20 8 12 2 12 2C11.6117 4.48692 11.2315 5.82158 10 8C8.79908 7.4449 8.5 7 8 5.75C6 8 4 11 4 14C4 18.4183 7.58172 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 17L14 13"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 13H10.009M13.991 17H14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="font-medium text-xs">Mã giảm giá</span>
                      <div className="absolute top-1.5 -left-1 space-y-1">
                        <div className="w-2 h-2 bg-util rounded-full"></div>
                        <div className="w-2 h-2 bg-util rounded-full"></div>
                        <div className="w-2 h-2 bg-util rounded-full"></div>
                        <div className="w-2 h-2 bg-util rounded-full"></div>
                        <div className="w-2 h-2 bg-util rounded-full"></div>
                        <div className="w-2 h-2 bg-util rounded-full"></div>
                        <div className="w-2 h-2 bg-util rounded-full"></div>
                        <div className="w-2 h-2 bg-util rounded-full"></div>
                        <div className="w-2 h-2 bg-util rounded-full"></div>
                      </div>
                    </div>
                    <div className="py-2 w-full pr-5 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium line-clamp-1">
                            {voucherCart.name}
                          </h4>
                          <span className="text-secondary/65 block">
                            Đơn Tối Thiểu đ
                            {voucherCart?.min_order_value?.toLocaleString()} - đ
                            {voucherCart?.max_order_value?.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-2">
                            <p className="flex items-center gap-1 text-primary text-xs bg-primary/10 py-1 px-2 rounded-[2px]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="size-3"
                                color="currentColor"
                                fill="none"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M12 8V12L14 14"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Hết hạn: {voucherCart.end_date}
                            </p>
                            <span className="text-primary border border-primary block w-fit px-2 text-xs">
                              Đủ điều kiện
                            </span>
                          </div>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectVoucher(voucherCart.code)
                            }
                          >
                            <div className="w-5 h-5 border shadow-inner rounded-full flex justify-center items-center">
                              {selectVoucher === voucherCart.code && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="size-5"
                                  color={"#ff9900"}
                                  fill={"none"}
                                >
                                  <path
                                    d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center mt-1 text-xs">
                        <div className="w-[25%]">
                          Còn lại: {voucherCart.usage_limit}
                        </div>
                        <Progress
                          percent={voucherCart.usage_limit}
                          size="small"
                          strokeColor="#ff9900"
                          status="active"
                          showInfo={false}
                          className="w-[75%]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </Modal>
      <form action="">
        <div className="space-y-2">
          <div className="block">
            <label htmlFor="voucher" className="flex gap-1">
              Nhập mã voucher{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#ff9900"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                />
              </svg>
            </label>
          </div>
          <div className="flex w-auto items-center rounded-[5px] overflow-hidden">
            <input
              type="text"
              onClick={showModal}
              value={selectVoucher}
              placeholder="Nhập code"
              id="value-voucher"
              className="block max-w-[73%] h-[35px] focus:!border-primary/50 focus:!border-r-transparent rounded-[5px] rounded-r-none border-r-transparent border border-input text-sm placeholder-[#00000040] focus:!shadow-none"
            />
            <button
              type="button"
              className={`block ${
                voucherCheck ? "bg-gray-400" : "bg-primary"
              } w-full h-[35px] px-2 text-sm text-util`}
              onClick={handleCheckVoucher}
              disabled={voucherCheck !== undefined}
            >
              Áp dụng
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm block">
              Khuyến mãi:{" "}
              <span className="text-sm text-primary">
                {voucherCheck
                  ? `-${voucherCheck?.discount.toLocaleString()} đ`
                  : `0đ`}
              </span>
            </label>
            <label className="text-sm block">
              Phí vận chuyển:{" "}
              <span className="text-sm text-primary">Miễn phí</span>
            </label>
          </div>
        </div>
      </form>
      <div className="space-y-2">
        <p className="font-medium">
          Tổng thanh toán:{" "}
          <span className="text-primary">
            {(voucherCheck
              ? final_total - voucherCheck.discount
              : final_total
            ).toLocaleString()}
            đ
          </span>
        </p>
      </div>
      <button
        className={`${
          current !== 2 ? "bg-[#D1D1D6]" : "bg-primary"
        } w-full block rounded-sm py-2 text-util`}
        onClick={submitOrder}
        disabled={current !== 2}
      >
        TIẾN HÀNH THANH TOÁN
      </button>
      <div className="space-y-2.5">
        <img
          src="../../../../src/assets/images/images-payment.svg"
          className="w-fit mx-auto"
          alt="image-payment"
        />
        <p className="text-sm text-center text-secondary/75">
          Đảm bảo an toàn và bảo mật
        </p>
      </div>
    </div>
  );
};

export default ConfirmOrder;
