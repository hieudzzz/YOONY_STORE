import { ConfigProvider, Dropdown, Input, Pagination } from "antd";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { IOrderUserClient } from "../../../../interfaces/IOrderUserClient";
import instance from "../../../../instance/instance";
import { Link, NavLink, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { IMeta } from "../../../../interfaces/IMeta";
import OrderStatusFilter from "./OrderStatusFilter";

export const checkPaymentMethod = (method: string) => {
  switch (method) {
    case "COD":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="Layer_1"
          data-name="Layer 1"
          viewBox="0 0 122.88 103.86"
          className="size-7"
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
       <img className="max-w-[50px] w-full" src="../../../../../src/assets/images/VNPAY_id-sVSMjm2_1.svg" alt="vnpay" />
      );

    case "MOMO":
      return (
        <img className="max-w-[28px] w-full" src="../../../../../src/assets/images/momo_icon_square_pinkbg.svg" alt="momo" />
      );

    default:
      break;
  }
};

export const status = (statusOrder: string) => {
  switch (statusOrder) {
    case "pending":
      return (
        <span className="bg-[#FEF6E7] text-primary px-2 py-1 rounded-sm text-sm flex items-center gap-1 w-fit mx-auto">
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
        <span className="bg-[#faf3e6] text-primary px-2 py-1 rounded-sm text-sm flex items-center gap-1 w-fit mx-auto">
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
        <span className="bg-[#E6EFFE] text-[#5695F7] px-2 py-1 rounded-sm text-sm flex items-center gap-1 w-fit mx-auto">
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
        <span className="bg-[#EAF9FC] text-[#32c8db] px-2 py-1 rounded-sm text-sm flex items-center gap-1 w-fit mx-auto">
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
        <span className="bg-[#DBF8F4] text-[#14D1B8] px-2 py-1 rounded-sm text-sm flex items-center gap-1 w-fit mx-auto">
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
        <span className="bg-[#FFECE3] text-[#FF7F40] px-2 py-1 rounded-sm text-sm flex items-center gap-1 w-fit mx-auto">
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

const ManagerOrdersUser = () => {
  const [orderUsers, setListOrderUsers] = useState<IOrderUserClient[]>([]);
  const [valueSearch, setValueSearch] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  const [filteredStatuses, setFilteredStatuses] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const { data } = await instance.get(`order?page=${page}`);
        if (data) {
          setListOrderUsers(data.data);
          setMeta(data.meta);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [page]);


  const checkIsCancelOrder = (statusOrder: string, code_order: string) => {
    switch (statusOrder) {
      case "pending":
      case "confirmed":
      case "preparing_goods":
        return (
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
        );
      case "shipping":
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
      case "delivered":
        return (
          <Link
            to={`/user-manager/user-ratings/rating-detail/${code_order}`}
            className="text-primary border border-[#f5f5f5] bg-util py-1.5 px-2 flex items-center flex-nowrap gap-1 rounded-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M8.5 15.5H15.5M8.5 10.5H12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 3C10.2752 3.01018 10.0515 3.02267 9.8294 3.03746C5.64639 3.31601 2.31441 6.70126 2.04024 10.9511C1.98659 11.7828 1.98659 12.6441 2.04024 13.4758C2.1401 15.0236 2.82343 16.4568 3.62791 17.6669C4.09501 18.5141 3.78674 19.5715 3.30021 20.4952C2.94941 21.1611 2.77401 21.4941 2.91484 21.7346C3.05568 21.9752 3.37026 21.9828 3.99943 21.9982C5.24367 22.0285 6.08268 21.6752 6.74868 21.1832C7.1264 20.9041 7.31527 20.7646 7.44544 20.7486C7.5756 20.7326 7.83177 20.8383 8.34401 21.0496C8.8044 21.2396 9.33896 21.3568 9.8294 21.3894C11.2536 21.4843 12.7435 21.4845 14.1706 21.3894C18.3536 21.1109 21.6856 17.7257 21.9598 13.4758C22.0134 12.6441 22.0134 11.7828 21.9598 10.9511C21.939 10.6288 21.9006 10.3114 21.8456 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.5 5H17.509"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.7948 4.59071C21.9316 4.77342 22 4.86477 22 5C22 5.13523 21.9316 5.22658 21.7948 5.40929C21.1801 6.23024 19.6101 8 17.5 8C15.3899 8 13.8199 6.23024 13.2052 5.40929C13.0684 5.22658 13 5.13523 13 5C13 4.86477 13.0684 4.77342 13.2052 4.59071C13.8199 3.76976 15.3899 2 17.5 2C19.6101 2 21.1801 3.76976 21.7948 4.59071Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span>Đánh giá</span>
          </Link>
        );
      default:
        break;
    }
  };

  const handleChangeValueSearch = (e: any) => {
    setValueSearch(e.target.value);
  };

  return (
    <div className="border border-[#f1f1f1] rounded-md p-4 space-y-3">
      <div className="space-y-5">
        <div className="flex justify-end gap-2 w-fit ml-auto">
          <Input
            className="w-full rounded-full border border-[#f1f1f1]"
            placeholder="Mã đơn hàng"
            onChange={handleChangeValueSearch}
            suffix={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                color="#000000"
                fill="none"
                className="text-primary"
              >
                <path
                  d="M11 22C10.1818 22 9.40019 21.6698 7.83693 21.0095C3.94564 19.3657 2 18.5438 2 17.1613C2 16.7742 2 10.0645 2 7M11 22V11.3548M11 22C11.3404 22 11.6463 21.9428 12 21.8285M20 7V11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
                <path
                  d="M20.1322 20.1589L22 22M21.2074 17.5964C21.2074 19.5826 19.594 21.1928 17.6037 21.1928C15.6134 21.1928 14 19.5826 14 17.5964C14 15.6102 15.6134 14 17.6037 14C19.594 14 21.2074 15.6102 21.2074 17.5964Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
          <ConfigProvider
            theme={{
              components: {
                Dropdown: {
                  controlItemBgHover: "#fff",
                },
              },
            }}
          >
            <Dropdown
              menu={{
                items: OrderStatusFilter({
                  onStatusChange: (statuses) => setFilteredStatuses(statuses),
                }),
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <button className=" bg-primary hover:bg-primary text-white text-sm py-2 px-2 rounded-sm focus:ring-primary flex items-center ">
                Fillter
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  color="currentColor"
                  fill="none"
                  className="ml-2 size-5"
                >
                  <path
                    d="M13 4L3 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 19L3 19"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 19L17 19"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 11.5L11 11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 4L19 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 11.5L3 11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.5 2C14.9659 2 15.1989 2 15.3827 2.07612C15.6277 2.17761 15.8224 2.37229 15.9239 2.61732C16 2.80109 16 3.03406 16 3.5L16 4.5C16 4.96594 16 5.19891 15.9239 5.38268C15.8224 5.62771 15.6277 5.82239 15.3827 5.92388C15.1989 6 14.9659 6 14.5 6C14.0341 6 13.8011 6 13.6173 5.92388C13.3723 5.82239 13.1776 5.62771 13.0761 5.38268C13 5.19891 13 4.96594 13 4.5L13 3.5C13 3.03406 13 2.80109 13.0761 2.61732C13.1776 2.37229 13.3723 2.17761 13.6173 2.07612C13.8011 2 14.0341 2 14.5 2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.5 17C12.9659 17 13.1989 17 13.3827 17.0761C13.6277 17.1776 13.8224 17.3723 13.9239 17.6173C14 17.8011 14 18.0341 14 18.5L14 19.5C14 19.9659 14 20.1989 13.9239 20.3827C13.8224 20.6277 13.6277 20.8224 13.3827 20.9239C13.1989 21 12.9659 21 12.5 21C12.0341 21 11.8011 21 11.6173 20.9239C11.3723 20.8224 11.1776 20.6277 11.0761 20.3827C11 20.1989 11 19.9659 11 19.5L11 18.5C11 18.0341 11 17.8011 11.0761 17.6173C11.1776 17.3723 11.3723 17.1776 11.6173 17.0761C11.8011 17 12.0341 17 12.5 17Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 9.5C9.96594 9.5 10.1989 9.5 10.3827 9.57612C10.6277 9.67761 10.8224 9.87229 10.9239 10.1173C11 10.3011 11 10.5341 11 11L11 12C11 12.4659 11 12.6989 10.9239 12.8827C10.8224 13.1277 10.6277 13.3224 10.3827 13.4239C10.1989 13.5 9.96594 13.5 9.5 13.5C9.03406 13.5 8.80109 13.5 8.61732 13.4239C8.37229 13.3224 8.17761 13.1277 8.07612 12.8827C8 12.6989 8 12.4659 8 12L8 11C8 10.5341 8 10.3011 8.07612 10.1173C8.17761 9.87229 8.37229 9.67761 8.61732 9.57612C8.80109 9.5 9.03406 9.5 9.5 9.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </Dropdown>
          </ConfigProvider>
        </div>
        <div className="overflow-x-auto table-order-users">
          <Table>
            <Table.Head>
              <Table.HeadCell className="bg-primary text-util text-sm font-normal capitalize !rounded-s-sm text-nowrap">
                Mã đơn hàng
              </Table.HeadCell>
              <Table.HeadCell className="bg-primary text-util text-sm font-normal capitalize text-nowrap">
                Ngày đặt hàng
              </Table.HeadCell>
              <Table.HeadCell className="bg-primary text-util text-sm font-normal capitalize text-nowrap">
                Tổng tiền
              </Table.HeadCell>
              <Table.HeadCell className="bg-primary text-util text-sm font-normal capitalize text-nowrap">
                Phương thức
              </Table.HeadCell>
              <Table.HeadCell className="bg-primary text-util text-sm font-normal capitalize text-nowrap text-center">
                Tình trạng
              </Table.HeadCell>
              <Table.HeadCell className="bg-primary text-util text-sm font-normal capitalize text-nowrap !rounded-r-sm">
                Hành động
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {orderUsers.length === 0 ||
              orderUsers.filter((items) => {
                const searchTerm = valueSearch.toLowerCase();
                const code = items.code.toLowerCase();
                const matchesSearch =
                  `#${code}`.includes(searchTerm) || code.includes(searchTerm);
                const matchesStatus =
                  filteredStatuses.length === 0 ||
                  filteredStatuses.includes(items.status_order);
                return matchesSearch && matchesStatus;
              }).length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <div className="flex flex-col items-center text-secondary/20 space-y-2 justify-center min-h-[50vh]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-16"
                        viewBox="0 0 64 41"
                      >
                        <g
                          fill="none"
                          fillRule="evenodd"
                          transform="translate(0 1)"
                        >
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
                      <p>Không có đơn hàng nào</p>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : (
                orderUsers
                  .filter((items) => {
                    const searchTerm = valueSearch.toLowerCase();
                    const code = items.code.toLowerCase();
                    const matchesSearch =
                      `#${code}`.includes(searchTerm) ||
                      code.includes(searchTerm);
                    const matchesStatus =
                      filteredStatuses.length === 0 ||
                      filteredStatuses.includes(items.status_order);
                    return matchesSearch && matchesStatus;
                  })
                  .map((orderUser) => (
                    <Table.Row className="bg-white" key={orderUser.id}>
                      <Table.Cell className="whitespace-nowrap text-primary">
                        <span className="border border-primary border-dashed py-1 px-2 rounded-sm bg-primary/10">
                          #{orderUser.code}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap text-secondary/75">
                        {dayjs(orderUser.created_at).format("DD-MM-YYYY HH:mm")}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap text-secondary/75">
                        <span className="text-primary">
                          {orderUser.final_total?.toLocaleString()}đ
                        </span>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap text-secondary/75">
                        <div className="flex justify-center items-center">
                          {checkPaymentMethod(orderUser.payment_method)}
                        </div>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap text-secondary/75">
                        {status(orderUser.status_order)}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap text-secondary/75">
                        <div className="flex items-center gap-2">
                          <NavLink
                            to={`/user-manager/user-orders/order-detail/${orderUser.code}`}
                            className="text-util bg-primary py-1.5 px-2 flex items-center flex-nowrap gap-1 rounded-sm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="size-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path d="M19 11V10C19 6.22876 19 4.34315 17.8284 3.17157C16.6569 2 14.7712 2 11 2C7.22876 2 5.34315 2 4.17157 3.17157C3 4.34315 3 6.22876 3 10V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22" />
                              <path d="M21 22L19.2857 20.2857M19.8571 17.4286C19.8571 19.3221 18.3221 20.8571 16.4286 20.8571C14.535 20.8571 13 19.3221 13 17.4286C13 15.535 14.535 14 16.4286 14C18.3221 14 19.8571 15.535 19.8571 17.4286Z" />
                              <path d="M7 7H15M7 11H11" />
                            </svg>
                            <span>Chi tiết</span>
                          </NavLink>
                          {checkIsCancelOrder(
                            orderUser.status_order,
                            orderUser.code
                          )}
                          {/* <button className="text-secondary/75">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="size-6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path d="M11.992 12H12.001M11.9842 18H11.9932M11.9998 6H12.0088" />
                            </svg>
                          </button> */}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
      <Pagination
        current={page}
        onChange={(page) => {
          setSearchParams({ page: String(page) });
        }}
        total={meta?.total || 0}
        pageSize={meta?.per_page || 10}
        showSizeChanger={false}
        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
        align="end"
      />
    </div>
  );
};

export default ManagerOrdersUser;
