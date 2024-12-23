import { Badge, ConfigProvider, Tabs } from "antd";
import type { TabsProps } from "antd";
import OrderListsAllAdmin from "./OrderListsAllAdmin";
import OrderListPending from "./OrderListPending";
import OrderListConfirmed from "./OrderListConfirmed";
import OrderListPreparing from "./OrderListPreparing";
import OrderListShipping from "./OrderListShipping";
import OrderListDelivered from "./OrderListDelivered";
import OrderListCancel from "./OrderListCancel";
import { useState } from "react";

const OrdersListAdmin = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [confirmedCount, setConfirmedCount] = useState<number>(0);
  const [preparingCount, setPreparingCount] = useState<number>(0);
  const [shippingCount, setShippingCount] = useState<number>(0);
  const [deliveredCount, setDeliveredCount] = useState<number>(0);
  const [canceldCount, setCanceldCount] = useState<number>(0);
  const [listAllCount, setListAllCount] = useState<number>(0);
  const onChange = (key: string) => {
    setActiveTab(key);
  };
  const items: TabsProps["items"] = [
    {
      key: "all",
      label: (
        <p>
          Tất cả
          <Badge
            offset={[5, 2]}
            count={listAllCount}
            size="small"
            color="orange"
            className="absolute top-1"
          ></Badge>
        </p>
      ),
      children: (
        <OrderListsAllAdmin
          activeTab={activeTab}
          setListAllCount={setListAllCount}
        />
      ),
    },
    {
      key: "pending",
      label: (
        <button className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="size-4"
            color={"currentColor"}
            fill={"none"}
          >
            <path
              d="M11 22C10.1818 22 9.40019 21.6698 7.83693 21.0095C3.94564 19.3657 2 18.5438 2 17.1613C2 16.7742 2 10.0645 2 7M11 22L11 11.3548M11 22C11.3404 22 11.6463 21.9428 12 21.8285M20 7V11.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 18.0005L18.9056 17.0949M22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22C20.2091 22 22 20.2091 22 18Z"
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
          </svg>
          <span>Chờ xác nhận</span>
          {pendingCount !== 0 && (
            <Badge
              offset={[10, 0]}
              count={pendingCount}
              size="small"
              color="orange"
              className="absolute -right-1 top-1"
            ></Badge>
          )}
        </button>
      ),
      children: (
        <OrderListPending
          activeTab={activeTab}
          setPendingCount={setPendingCount}
        />
      ),
    },
    {
      key: "confirmed",
      label: (
        <div className="flex items-center gap-2">
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
          <span>Đã xác nhận</span>
          {confirmedCount !== 0 && (
            <Badge
              offset={[10, 0]}
              count={confirmedCount}
              size="small"
              color="orange"
              className="absolute -right-1 top-1"
            ></Badge>
          )}
        </div>
      ),
      children: (
        <OrderListConfirmed
          activeTab={activeTab}
          setConfirmedCount={setConfirmedCount}
        />
      ),
    },
    {
      key: "preparing_goods",
      label: (
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="size-4"
            color={"currentColor"}
            fill={"none"}
          >
            <path
              d="M19.4483 8.04705L14.7814 6.22588C14.3956 6.07529 14.2026 6 14 6C13.7974 6 13.6045 6.07529 13.2186 6.22588L8.55166 8.04705C7.51722 8.45073 7 8.65256 7 9C7 9.34744 7.51722 9.54927 8.55166 9.95295L13.2186 11.7741C13.6045 11.9247 13.7974 12 14 12C14.2026 12 14.3956 11.9247 14.7814 11.7741L19.4483 9.95295C20.4828 9.54927 21 9.34744 21 9C21 8.65256 20.4828 8.45073 19.4483 8.04705Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 22C14.2026 22 14.3956 21.9247 14.7814 21.7741L19.4483 19.9529C20.4828 19.5493 21 19.3474 21 19V9M14 22C13.7974 22 13.6045 21.9247 13.2186 21.7741L8.55166 19.9529C7.51722 19.5493 7 19.3474 7 19V9M14 22V12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.5 7.5L10.5 10.5V13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 3H21M7 3V2M7 3V4M21 3V2M21 3V4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 7L4 21M4 7L5 7M4 7L3 7M4 21H5M4 21H3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Đang chuẩn bị hàng</span>
          {preparingCount !== 0 && (
            <Badge
              offset={[10, 0]}
              count={preparingCount}
              size="small"
              color="orange"
              className="absolute -right-1 top-1"
            ></Badge>
          )}
        </div>
      ),
      children: (
        <OrderListPreparing
          activeTab={activeTab}
          setPreparingCount={setPreparingCount}
        />
      ),
    },
    {
      key: "shipping",
      label: (
        <div className="flex items-center gap-2">
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
          <span>Đang vận chuyển</span>
          {shippingCount !== 0 && (
            <Badge
              offset={[10, 0]}
              count={shippingCount}
              size="small"
              color="orange"
              className="absolute -right-1 top-1"
            ></Badge>
          )}
        </div>
      ),
      children: <OrderListShipping activeTab={activeTab} setShippingCount={setShippingCount} />,
    },
    {
      key: "delivered",
      label: (
        <div className="flex items-center gap-2">
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
          <span>Đã giao hàng</span>
          {deliveredCount !== 0 && (
            <Badge
              offset={[10, 0]}
              count={deliveredCount}
              size="small"
              color="orange"
              className="absolute -right-1 top-1"
            ></Badge>
          )}
        </div>
      ),
      children: <OrderListDelivered activeTab={activeTab} setDeliveredCount={setDeliveredCount} />,
    },
    {
      key: "canceled",
      label: (
        <div className="flex items-center gap-2">
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
          <span>Đơn hàng đã bị huỷ</span>
          {canceldCount !== 0 && (
            <Badge
              offset={[10, 0]}
              count={canceldCount}
              size="small"
              color="orange"
              className="absolute -right-1 top-1"
            ></Badge>
          )}
        </div>
      ),
      children: <OrderListCancel activeTab={activeTab} setCanceldCount={setCanceldCount} />,
    },
  ];
  return (
    <div className="space-y-5 bg-util pt-2 px-5 pb-5 rounded-md min-h-[90vh]">
      <div>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#ff9900",
            },
            components: {
              Tabs: {
                itemHoverColor: "#ff9900",
                horizontalItemGutter: 50,
              },
            },
          }}
        >
          <Tabs defaultActiveKey="all" items={items} onChange={onChange} />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default OrdersListAdmin;
