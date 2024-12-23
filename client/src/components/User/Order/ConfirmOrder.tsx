import axios from "axios";
import { toast } from "react-toastify";
import instance from "../../../instance/instance";
import { useContext, useEffect, useState } from "react";
import CartContext from "../../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { Modal, Input, Progress, message, ConfigProvider } from "antd";
import { IVoucher } from "../../../interfaces/IVouchers";
import queryString from "query-string";
import { useRef } from "react";
type Prop = {
  current: number;
  setIsLoading: (isLoading: boolean) => void;
};

const ConfirmOrder = ({ current, setIsLoading }: Prop) => {
  const { dispatch } = useContext(CartContext);
  const final_total = JSON.parse(localStorage.getItem("final_total") || "0");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voucherCarts, setVoucherCarts] = useState<IVoucher[]>([]);
  const [valueSearch, setChangeValueSearch] = useState<string>("");
  const [selectVoucher, setSelectVoucher] = useState<string>("");
  const [voucherCheck, setCheckVoucher] = useState<IVoucher | undefined>(
    undefined
  );
  const [modal2Open, setModal2Open] = useState(false);
  const [errorConfirmOrder, setErrorConfirmOrder] = useState<string>("");
  const callbackProcessedRef = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const parsed = queryString.parse(location.search);
        const vnp_ResponseCode = parsed?.vnp_ResponseCode;
        const resultCode = parsed?.resultCode;
        const vnp_TransactionStatus = parsed?.vnp_TransactionStatus;
        const isCallbackProcessed = localStorage.getItem("callback_processed");
        const savedVoucher = JSON.parse(
          localStorage.getItem("selected_voucher") || "null"
        );
        const finalPaymentAmountVnpay = savedVoucher
          ? savedVoucher.discount_type === "percentage"
            ? (() => {
                const calculatedDiscount =
                  (final_total * savedVoucher.discount) / 100;
                const finalDiscount =
                savedVoucher.max_discount &&
                  calculatedDiscount > savedVoucher.max_discount
                    ? savedVoucher.max_discount
                    : calculatedDiscount;
                return final_total - finalDiscount;
              })()
            : savedVoucher.discount > final_total
            ? 0
            : final_total - savedVoucher.discount
          : final_total;

        if (isCallbackProcessed || callbackProcessedRef.current) {
          return;
        }

        localStorage.setItem("callback_processed", "true");
        callbackProcessedRef.current = true;

        const orderDataRaw = localStorage.getItem("orderData");
        const parsedOrderData = JSON.parse(orderDataRaw!);

        const formattedAddress = [
          parsedOrderData?.addressDetail,
          parsedOrderData?.ward,
          parsedOrderData?.district,
          parsedOrderData?.province,
        ]
          .filter(Boolean)
          .join(", ");

        if (vnp_ResponseCode && vnp_TransactionStatus === "00") {
          const { data } = await instance.post("vnpay/callback", {
            ...parsed,
          });
          if (
            vnp_ResponseCode === "00" &&
            vnp_TransactionStatus === "00" &&
            String(data.status) === "success"
          ) {
            // message.success("Thanh toán thành công!");
            const checkoutData = await instance.post("checkout-vnpay", {
              name: parsedOrderData.fullName,
              tel: parsedOrderData.phone,
              coupon_id: savedVoucher?.id,
              discount_amount: savedVoucher?.discount,
              final_total: finalPaymentAmountVnpay,
              address: formattedAddress,
              ...parsedOrderData,
            });

            if (checkoutData) {
              const id_carts = JSON.parse(
                localStorage.getItem("id_cart") || "[]"
              );
              dispatch({
                type: "REMOVE_SELECTED",
                payload: id_carts,
              });
              toast.success(checkoutData.data.message);
              navigate("/user-manager/user-orders");
              [
                "id_cart",
                "orderData",
                "final_total",
                "callback_processed",
                "selected_voucher",
              ].forEach((key) => localStorage.removeItem(key));
            }
          }
        } else {
          await instance.post("vnpay/callback", {
            ...parsed,
          });
          // console.log(data);
        }

        if (resultCode) {
          const { data } = await instance.post("momo/callback", {
            ...parsed,
          });

          if (resultCode === "0" && String(data.status) === "success") {
            // message.success("Thanh toán thành công!");
            const checkoutData = await instance.post("checkout-momo", {
              name: parsedOrderData.fullName,
              tel: parsedOrderData.phone,
              coupon_id: savedVoucher?.id,
              discount_amount: savedVoucher?.discount,
              final_total: finalPaymentAmountVnpay,
              address: formattedAddress,
              ...parsedOrderData,
            });

            if (checkoutData) {
              const id_carts = JSON.parse(
                localStorage.getItem("id_cart") || "[]"
              );
              dispatch({
                type: "REMOVE_SELECTED",
                payload: id_carts,
              });
              toast.success(checkoutData.data.message);
              navigate("/user-manager/user-orders");
              [
                "id_cart",
                "orderData",
                "final_total",
                "callback_processed",
                "selected_voucher",
              ].forEach((key) => localStorage.removeItem(key));
            }
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
    return () => {
      callbackProcessedRef.current = false;
      localStorage.removeItem("callback_processed");
    };
  }, [dispatch, final_total, navigate]);

  const finalPaymentAmount = voucherCheck
  ? voucherCheck.discount_type === "percentage"
    ? (() => {
        const calculatedDiscount =
          (final_total * voucherCheck.discount) / 100;
        const finalDiscount =
          voucherCheck.max_discount &&
          calculatedDiscount > voucherCheck.max_discount
            ? voucherCheck.max_discount
            : calculatedDiscount;
        return final_total - finalDiscount;
      })()
    : voucherCheck.discount > final_total
    ? 0
    : final_total - voucherCheck.discount
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
    setIsLoading(true);
    try {
      const orderDataRaw = localStorage.getItem("orderData");
      const parsedOrderData = JSON.parse(orderDataRaw!);

      const formattedAddress = [
        parsedOrderData?.addressDetail,
        parsedOrderData?.ward,
        parsedOrderData?.district,
        parsedOrderData?.province,
      ]
        .filter(Boolean)
        .join(", ");

      if (parsedOrderData?.payment_method === "COD") {
        const { data } = await instance.post("checkout", {
          name: parsedOrderData.fullName,
          tel: parsedOrderData.phone,
          coupon_id: voucherCheck?.id,
          discount_amount: voucherCheck?.discount,
          final_total: finalPaymentAmount,
          address: formattedAddress,
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
          ["id_cart", "orderData", "final_total", "selected_voucher"].forEach(
            (key) => localStorage.removeItem(key)
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
          address: formattedAddress,
          ...parsedOrderData,
        });

        if (data) {
          window.location.assign(data.paymentUrl);
        }
      }
      if (parsedOrderData?.payment_method === "MOMO") {
        const { data } = await instance.post("checkout", {
          name: parsedOrderData.fullName,
          tel: parsedOrderData.phone,
          coupon_id: voucherCheck?.id,
          discount_amount: voucherCheck?.discount,
          final_total: finalPaymentAmount,
          address: formattedAddress,
          ...parsedOrderData,
        });

        if (data) {
          window.location.assign(data.paymentUrl);
        }
      }
    } catch (error) {
      if (error) {
        setModal2Open(true);
        setErrorConfirmOrder(error.response?.data?.error);
      }
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Đã xảy ra lỗi không mong muốn");
      }
    } finally {
      setIsLoading(false);
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
      localStorage.setItem("selected_voucher", JSON.stringify(validVoucher));
      message.success("Mã giảm giá đã được áp dụng");
    } else {
      message.warning("Mã voucher không hợp lệ!");
    }
  };

  return (
    <div className="col-span-12 lg:col-span-3 border border-input p-3 rounded-md h-fit space-y-6 sticky top-20 bg-util">
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
          {voucherCarts.length === 0 ? (
            <div className="flex flex-col items-center text-secondary/20 space-y-2 justify-center min-h-[50vh]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-16"
                viewBox="0 0 64 41"
              >
                <g fill="none" fillRule="evenodd" transform="translate(0 1)">
                  <ellipse
                    cx="32"
                    cy="33"
                    fill="#f5f5f5"
                    rx="32"
                    ry="7"
                  ></ellipse>
                  <g fillRule="nonzero" stroke="#d9d9d9">
                    <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                    <path
                      fill="#fafafa"
                      d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                    ></path>
                  </g>
                </g>
              </svg>
              <p>Không có mã giảm nào đủ điều kiện</p>
            </div>
          ) : (
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
                          {voucherCart.discount_type !== "percentage" ? (
                            <span className="text-secondary/65 block">
                              Đơn Tối Thiểu đ
                              {voucherCart?.min_order_value?.toLocaleString()} -
                              đ{voucherCart?.max_order_value?.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-secondary/65 block">
                              Giảm giá {voucherCart?.discount}% - Giảm tối đa: {voucherCart?.max_discount.toLocaleString()}đ
                            </span>
                          )}

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
              })
          )}
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
          <div className="flex items-center rounded-[5px] overflow-hidden">
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
              } w-auto lg:w-full h-[35px] px-2 text-sm text-util`}
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
                  ? voucherCheck.discount_type === "percentage"
                    ? (() => {
                        const calculatedDiscount =
                          (final_total * voucherCheck.discount) / 100;
                        const finalDiscount =
                          voucherCheck.max_discount &&
                          calculatedDiscount > voucherCheck.max_discount
                            ? voucherCheck.max_discount
                            : calculatedDiscount;
                        return `-${finalDiscount.toLocaleString()}đ`;
                      })()
                    : `-${(voucherCheck.discount > final_total
                        ? final_total
                        : voucherCheck.discount
                      ).toLocaleString()}đ`
                  : "0đ"}
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
          {/* <span className="text-primary">
            {(voucherCheck
              ? voucherCheck.discount_type === "percentage"
                ? final_total - (final_total * voucherCheck.discount) / 100
                : voucherCheck.discount > final_total
                ? 0
                : final_total - voucherCheck.discount
              : final_total
            ).toLocaleString()}
            đ
          </span> */}
          <span className="text-sm text-primary">
            {(voucherCheck
              ? voucherCheck.discount_type === "percentage"
                ? (() => {
                    const calculatedDiscount =
                      (final_total * voucherCheck.discount) / 100;
                    const finalDiscount =
                      voucherCheck.max_discount &&
                      calculatedDiscount > voucherCheck.max_discount
                        ? voucherCheck.max_discount
                        : calculatedDiscount;
                    return final_total - finalDiscount;
                  })()
                : voucherCheck.discount > final_total
                ? 0
                : final_total - voucherCheck.discount
              : final_total
            ).toLocaleString()}đ
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
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#ff9900",
          },
        }}
      >
        <Modal
          centered
          open={modal2Open}
          onOk={() => navigate("/gio-hang")}
          onCancel={() => setModal2Open(false)}
          cancelText={"Trở lại"}
          okText={"Giỏ hàng"}
          width={320}
        >
          <div className="space-y-5 mb-7">
            <div className="p-5 bg-primary/10 text-red-400 w-fit rounded-full mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-10"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M11 22C10.1818 22 9.40019 21.6698 7.83693 21.0095C3.94564 19.3657 2 18.5438 2 17.1613C2 16.7742 2 10.0645 2 7M11 22L11 11.3548M11 22C11.6167 22 12.12 21.8124 13 21.4372M20 7V12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 15L19 18M19 18L22 21M19 18L16 21M19 18L22 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M7.32592 9.69138L4.40472 8.27785C2.80157 7.5021 2 7.11423 2 6.5C2 5.88577 2.80157 5.4979 4.40472 4.72215L7.32592 3.30862C9.12883 2.43621 10.0303 2 11 2C11.9697 2 12.8712 2.4362 14.6741 3.30862L17.5953 4.72215C19.1984 5.4979 20 5.88577 20 6.5C20 7.11423 19.1984 7.5021 17.5953 8.27785L14.6741 9.69138C12.8712 10.5638 11.9697 11 11 11C10.0303 11 9.12883 10.5638 7.32592 9.69138Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 12L7 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 4L6 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-red-400 text-center">{errorConfirmOrder}</p>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default ConfirmOrder;
