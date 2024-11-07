import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../../../../instance/instance";
import { IOrderUserClient } from "../../../../interfaces/IOrderUserClient";
import { Steps, Popover, Input, Radio, Space, message } from "antd";
import type { RadioChangeEvent } from "antd";
import { useForm } from "react-hook-form";
const UserOrderDetail = () => {
  const { code_order } = useParams();
  const [orderDetails, setOrderDetails] = useState<IOrderUserClient>();
  const [checkStatusCurrent, setCheckStatusCurrent] = useState<number>(0);
  const [valueReason, setValueReason] = useState<string>("");
  const { setValue, watch } = useForm<{ reason: any }>();
  const onChange = (e: RadioChangeEvent) => {
    setValueReason(e.target.value);
  };

  useEffect(() => {
    (async () => {
      const {
        data: { data: response },
      } = await instance.get(`order-detail/${code_order}`);
      console.log(response);
      setOrderDetails(response);
    })();
  }, [valueReason]);
  const status = (statusOrder: string) => {
    switch (statusOrder) {
      case "pending":
        return (
          <span className="bg-[#FEF6E7] text-primary px-2 py-1 rounded-sm text-xs flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M12 3V6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 18V21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M21 12L18 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M6 12L3 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M18.3635 5.63672L16.2422 7.75804"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7.75804 16.2422L5.63672 18.3635"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M18.3635 18.3635L16.2422 16.2422"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7.75804 7.75804L5.63672 5.63672"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Chờ xác nhận
          </span>
        );
      case "confirmed":
        return (
          <span className="bg-[#faf3e6] text-primary px-2 py-1 rounded-sm text-xs flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Đã xác nhận
          </span>
        );
      case "preparing_goods":
        return (
          <span className="bg-[#E6EFFE] text-[#5695F7] px-2 py-1 rounded-sm text-xs flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M12 22C11.1818 22 10.4002 21.6698 8.83693 21.0095C4.94564 19.3657 3 18.5438 3 17.1613C3 16.7742 3 10.0645 3 7M12 22C12.8182 22 13.5998 21.6698 15.1631 21.0095C19.0544 19.3657 21 18.5438 21 17.1613V7M12 22L12 11.3548"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.32592 9.69138L5.40472 8.27785C3.80157 7.5021 3 7.11423 3 6.5C3 5.88577 3.80157 5.4979 5.40472 4.72215L8.32592 3.30862C10.1288 2.43621 11.0303 2 12 2C12.9697 2 13.8712 2.4362 15.6741 3.30862L18.5953 4.72215C20.1984 5.4979 21 5.88577 21 6.5C21 7.11423 20.1984 7.5021 18.5953 8.27785L15.6741 9.69138C13.8712 10.5638 12.9697 11 12 11C11.0303 11 10.1288 10.5638 8.32592 9.69138Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 12L8 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 4L7 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Đang chuẩn bị hàng
          </span>
        );
      case "shipping":
        return (
          <span className="bg-[#EAF9FC] text-[#32c8db] px-2 py-1 rounded-sm text-xs flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
              color={"currentColor"}
              fill={"none"}
            >
              <circle
                cx="17"
                cy="18"
                r="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="7"
                cy="18"
                r="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M5 17.9724C3.90328 17.9178 3.2191 17.7546 2.73223 17.2678C2.24536 16.7809 2.08222 16.0967 2.02755 15M9 18H15M19 17.9724C20.0967 17.9178 20.7809 17.7546 21.2678 17.2678C22 16.5355 22 15.357 22 13V11H17.3C16.5555 11 16.1832 11 15.882 10.9021C15.2731 10.7043 14.7957 10.2269 14.5979 9.61803C14.5 9.31677 14.5 8.94451 14.5 8.2C14.5 7.08323 14.5 6.52485 14.3532 6.07295C14.0564 5.15964 13.3404 4.44358 12.4271 4.14683C11.9752 4 11.4168 4 10.3 4H2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 8H8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 11H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.5 6H16.3212C17.7766 6 18.5042 6 19.0964 6.35371C19.6886 6.70742 20.0336 7.34811 20.7236 8.6295L22 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Đang vận chuyển
          </span>
        );
      case "delivered":
        return (
          <span className="bg-[#DBF8F4] text-[#14D1B8] px-2 py-1 rounded-sm text-xs flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M21 7V12M3 7C3 10.0645 3 16.7742 3 17.1613C3 18.5438 4.94564 19.3657 8.83693 21.0095C10.4002 21.6698 11.1818 22 12 22L12 11.3548"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 19C15 19 15.875 19 16.75 21C16.75 21 19.5294 16 22 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.32592 9.69138L5.40472 8.27785C3.80157 7.5021 3 7.11423 3 6.5C3 5.88577 3.80157 5.4979 5.40472 4.72215L8.32592 3.30862C10.1288 2.43621 11.0303 2 12 2C12.9697 2 13.8712 2.4362 15.6741 3.30862L18.5953 4.72215C20.1984 5.4979 21 5.88577 21 6.5C21 7.11423 20.1984 7.5021 18.5953 8.27785L15.6741 9.69138C13.8712 10.5638 12.9697 11 12 11C11.0303 11 10.1288 10.5638 8.32592 9.69138Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 12L8 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 4L7 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Đã giao hàng
          </span>
        );
      case "canceled":
        return (
          <span className="bg-[#FFECE3] text-[#FF7F40] px-2 py-1 rounded-sm text-xs flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
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
            Đơn hàng đã bị hủy
          </span>
        );
      default:
        break;
    }
  };

  useEffect(() => {
    switch (orderDetails?.status_order) {
      case "pending":
        return setCheckStatusCurrent(0);
      case "confirmed":
        return setCheckStatusCurrent(1);
      case "preparing_goods":
        return setCheckStatusCurrent(2);
      case "shipping":
        return setCheckStatusCurrent(3);
      case "delivered":
        return setCheckStatusCurrent(5);
      default:
        break;
    }
  }, [orderDetails?.status_order]);

  const handleCancelOrder = async () => {
    try {
      const {
        data: { data: response },
      } = await instance.patch(`order-cancelation/${orderDetails?.id}`, {
        reason: valueReason === "Khác" ? watch("reason") : valueReason,
      });
      if (response) {
        setValueReason("");
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        message.success("Huỷ đơn hàng thành công");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const content = () => {
    return (
      <div className="space-y-3">
        <Radio.Group onChange={onChange} value={valueReason}>
          <Space direction="vertical">
            <Radio value={"Đổi ý không muốn mua nữa"}>
              Đổi ý không muốn mua nữa
            </Radio>
            <Radio value={"Muốn thay đổi địa chỉ/thông tin đơn hàng"}>
              Muốn thay đổi địa chỉ/thông tin đơn hàng
            </Radio>
            <Radio value={"Tìm được sản phẩm rẻ hơn"}>
              Tìm được sản phẩm rẻ hơn
            </Radio>
            <Radio value={"Khác"}>
              Khác...
              {valueReason === "Khác" ? (
                <Input
                  style={{
                    width: 200,
                    marginInlineStart: 10,
                    height: 30,
                    borderRadius: 5,
                    fontSize: 14,
                    borderColor: "#e6e6eb",
                  }}
                  onChange={(e) => {
                    setValue("reason", e.target.value);
                  }}
                />
              ) : null}
            </Radio>
          </Space>
        </Radio.Group>
        <button
          className="block py-1.5 px-2.5 bg-primary text-util rounded-sm"
          onClick={handleCancelOrder}
        >
          Xác nhận huỷ
        </button>
      </div>
    );
  };

  const checkPaymentMethod = (method: string) => {
    switch (method) {
      case "COD":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 122.88 103.86"
            className="size-10"
            fill="#ff9900"
          >
            <path d="M33.8 51.87a29.8 29.8 0 0 1 8.94 1.32L40.06 61l-.64.39a12.6 12.6 0 0 0-2.93-1.1 13 13 0 0 0-3.08-.41 5.06 5.06 0 0 0-4.3 1.73c-.86 1.15-1.31 3.08-1.31 5.78 0 3.16.51 5.46 1.51 6.91a5.4 5.4 0 0 0 4.74 2.17 18.3 18.3 0 0 0 3.05-.27 15 15 0 0 0 3-.75l.77.48-.77 7.72a22.9 22.9 0 0 1-6.79.92c-5.25 0-9.18-1.37-11.84-4.1s-4-6.72-4-12 1.41-9.35 4.26-12.24 6.88-4.35 12.08-4.35Zm24.93 0c4.58 0 8.14 1.37 10.64 4.06s3.76 6.55 3.76 11.51c0 5.46-1.38 9.7-4.13 12.68s-6.65 4.49-11.69 4.49c-4.59 0-8.15-1.38-10.64-4.12s-3.76-6.64-3.76-11.69c0-5.4 1.39-9.59 4.13-12.52s6.64-4.41 11.69-4.41m-.88 7.8a5.17 5.17 0 0 0-2.88.66 3.7 3.7 0 0 0-1.39 2.32 21.6 21.6 0 0 0-.41 4.83 33.4 33.4 0 0 0 .43 6.15 4.9 4.9 0 0 0 1.49 2.93 4.92 4.92 0 0 0 3.1.82 5.2 5.2 0 0 0 2.88-.65 3.72 3.72 0 0 0 1.39-2.35 22.4 22.4 0 0 0 .42-4.85 32 32 0 0 0-.45-6.1 4.84 4.84 0 0 0-1.49-2.93 4.93 4.93 0 0 0-3.09-.83M91 52.21c4.66-.07 8.25 1.29 10.72 3.79s3.74 6.15 3.74 10.9c0 5.63-1.46 10-4.35 13s-7 4.53-12.45 4.53q-5.07 0-11.91-.43l.5-9.28-.5-22.3zm-.48 24.95A4 4 0 0 0 94 75.33c.77-1.21 1.2-3.24 1.2-6a25 25 0 0 0-.5-5.61 5.37 5.37 0 0 0-1.55-3 4.5 4.5 0 0 0-3-.9 34 34 0 0 0-3.67.19l-.34 13.72.1 3a35 35 0 0 0 4.25.4Z"></path>
            <path d="M10.89 7.83a3 3 0 0 0-3 3V93a3.23 3.23 0 0 0 3 3h101.16a3 3 0 0 0 3-3V10.86a3 3 0 0 0-3-3H10.89ZM114.68 0a8.26 8.26 0 0 1 5.8 2.41 8.44 8.44 0 0 1 2.4 5.79v87.45c0 2.17-.53 4.7-2.4 5.79a8.23 8.23 0 0 1-5.79 2.42H8.19a8.23 8.23 0 0 1-5.79-2.42C.53 100.35 0 97.82 0 95.65V8.2a8.2 8.2 0 0 1 2.4-5.79A8.26 8.26 0 0 1 8.2 0Z"></path>
            <path
              fillRule="evenodd"
              d="M78.8 7.68H44.09v32.71l17.33-8.68 17.38 8.68z"
            ></path>
          </svg>
        );
      case "VNPAY":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="size-16"
            fill="none"
            viewBox="0 0 40 18"
          >
            <path fill="url(#pattern0_804_4267)" d="M0 0H40V17.707H0z"></path>
            <defs>
              <pattern
                id="pattern0_804_4267"
                width="1"
                height="1"
                patternContentUnits="objectBoundingBox"
              >
                <use
                  transform="scale(.00395 .00893)"
                  xlinkHref="#image0_804_4267"
                ></use>
              </pattern>
              <image
                id="image0_804_4267"
                width="253"
                height="112"
                xlinkHref="data:image/png;base64,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"
              ></image>
            </defs>
          </svg>
        );

      default:
        break;
    }
  };

  const checkButtonCancel = (status_order: string) => {
    switch (status_order) {
      case "shipping":
      case "delivered":
      case "canceled":
        return (
          <button
            type="button"
            disabled
            className=" text-secondary/20 bg-secondary/10 hover:cursor-not-allowed py-1.5 px-2 flex items-center flex-nowrap gap-1 rounded-sm"
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
        );
      case "pending":
      case "confirmed":
      case "preparing_goods":
        return (
          <Popover
            content={content}
            title="Lý do huỷ đơn hàng ?"
            trigger="click"
            placement={"topRight"}
          >
            <button
              type="button"
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
          </Popover>
        );

      default:
        break;
    }
  };

  return (
    <div className="grid grid-cols-7 gap-5">
      <div className="col-span-5 w-full space-y-4">
        <div className="border border-[#f1f1f1] rounded-md bg-util p-3 space-y-4">
          <h3 className="uppercase font-medium text-sm">
            Đơn hàng <span className="text-primary">#{code_order}</span>
          </h3>
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
              {orderDetails &&
                orderDetails.items.map((item, index) => {
                  return (
                    <tr
                      className="text-secondary/75 text-sm border-b border-dashed border-input"
                      key={index + 1}
                    >
                      <td className="py-4">
                        <div className="flex gap-3 w-fit items-center">
                          <img
                            src={
                              item.variant.image ||
                              item.variant.product.images[0]
                            }
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                          <div className="space-y-1">
                            <Link
                              to={`/${item.variant.product.category?.slug}/${item.variant.product.slug}`}
                              className="line-clamp-1 text-sm hover:text-primary"
                            >
                              {item.variant.product.name}
                            </Link>
                            <div className="flex gap-3 text-secondary/50 flex-wrap">
                              {item.variant.attribute_values.map(
                                (attribute_value) => {
                                  return (
                                    <div
                                      className="text-[13px]"
                                      key={attribute_value.id}
                                    >
                                      <span>
                                        {attribute_value.attribute.name}
                                      </span>{" "}
                                      : <span>{attribute_value.value}</span>
                                    </div>
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
                        {orderDetails?.grand_total.toLocaleString()}đ
                      </span>
                    </p>
                    <p className="font-medium flex justify-between">
                      <span>
                        Giảm giá:{" "}
                        <span className="text-secondary/30">
                          {Number(orderDetails?.coupons.length) >= 1 &&
                            `(${orderDetails?.coupons[0].coupon.code})`}
                        </span>
                      </span>
                      <span className="block mr-2 text-primary">
                        {Number(orderDetails?.coupons.length) >= 1
                          ? `-${Number(
                              orderDetails?.coupons[0].discount_amount
                            ).toLocaleString()}đ`
                          : "0đ"}
                      </span>
                    </p>
                    <p className="border-t border-dashed border-input pt-3 font-medium flex justify-between">
                      Tổng thanh toán:{" "}
                      <span className="block mr-2 text-[#0DD1B7]">
                        {orderDetails?.final_total.toLocaleString()}đ
                      </span>
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="border border-[#f1f1f1] rounded-md bg-util p-3 space-y-2">
          <div className="flex items-center justify-between pt-2 pb-4 border-b border-input/50">
            <h3 className="uppercase font-medium text-sm flex items-center gap-2">
              Trạng thái đơn hàng: {status(orderDetails?.status_order!)}
            </h3>
            {checkButtonCancel(orderDetails?.status_order)}
          </div>
          <div>
            {orderDetails?.status_order !== "canceled" ? (
              <Steps
                direction="vertical"
                size="small"
                current={checkStatusCurrent}
                style={{ backgroundColor: "white" }}
                items={[
                  { title: "Chờ xác nhận", description:"Đơn hàng mới được tạo, đang chờ người bán xác nhận" },
                  {
                    title: "Đã xác nhận",
                    description:'Người bán đã tiếp nhận và xác nhận đơn hàng',
                  },
                  {
                    title: "Đang chuẩn bị hàng",
                    description:'Người bán đang đóng gói và chuẩn bị hàng để giao',
                  },
                  {
                    title: "Đang vận chuyển",
                    description:'Đơn hàng đang được đơn vị vận chuyển giao đến bạn',
                  },
                  {
                    title: "Đã giao hàng",
                    description:'Đơn hàng đã được giao thành công đến người nhận',
                  },
                ]}
              />
            ) : (
              <Steps
                direction="vertical"
                size="small"
                current={0}
                style={{ backgroundColor: "white" }}
                items={[
                  {
                    title: "Đơn hàng đã bị hủy",
                    description:`${valueReason}`,
                    status: "error",
                  },
                ]}
              />
            )}
          </div>
        </div>
      </div>
      <div className="col-span-2 space-y-4">
        <div className="border border-[#f1f1f1] rounded-md bg-util p-3 space-y-2">
          <h3 className="uppercase font-medium text-sm flex items-center gap-2 pb-4 border-b border-input/50">
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
                <span className="font-normal">{orderDetails?.name}</span>
              </label>
            </p>
            <p>
              <label htmlFor="email" className="text-sm font-medium">
                Email:{" "}
                <span className="font-normal">{orderDetails?.user.email}</span>
              </label>
            </p>
            <p>
              <label htmlFor="phone" className="text-sm font-medium">
                Số điện thoại:{" "}
                <span className="font-normal">{orderDetails?.tel}</span>
              </label>
            </p>
          </div>
        </div>
        <div className="border border-[#f1f1f1] rounded-md bg-util p-3 space-y-2">
          <h3 className="uppercase font-medium text-sm flex items-center gap-2 pb-4 border-b border-input/50">
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
              <span className="font-normal">{orderDetails?.address}</span>
            </label>
          </p>
        </div>
        <div className="border border-[#f1f1f1] rounded-md bg-util p-3 space-y-2">
          <h3 className="uppercase font-medium text-sm flex items-center gap-2 pb-4 border-b border-input/50">
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
            {checkPaymentMethod(String(orderDetails?.payment_method))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetail;
