import { Button, message, Steps, theme } from "antd";
import React, { useContext, useState } from "react";
import ConfirmOrder from "./ConfirmOrder";
import SelectMethodPayment from "./SelectMethodPayment";
import OrderSummary from "./OrderSummary";
import AddressSelect from "./AddressSelect";
import AddressProvider from "../../../providers/AddressProvider";
import LoadingOverlay from "react-loading-overlay-ts";
const CustomIcon = ({ icon, isCompleted }) => (
  <div
    className={`custom-icon-wrapper p-2 rounded-md ${
      isCompleted ? "bg-primary text-util" : "bg-gray-200 text-gray-400"
    }`}
  >
    {icon}
  </div>
);

const CheckOutOrder = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [addressSelected, setAddressSelected] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const addressSelect = (() => {
    try {
      const data = localStorage.getItem("addressSelect");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error parsing userInfor:", error);
      return null;
    }
  })();
  const validateCurrentStep = () => {
    if (!addressSelect) {
      message.error("Vui lòng thêm địa chỉ giao hàng trước khi tiếp tục.");
      return false;
    }
    switch (current) {
      case 0:
        if (!addressSelected) {
          message.error("Vui lòng chọn địa chỉ giao hàng.");
          return false;
        }
        return true;
      case 1:
        return true;
      case 2:
        return true;
      default:
        return false;
    }
  };

  const next = () => {
    if (validateCurrentStep()) {
      setCurrent(current + 1);
    } else {
      // message.error("Vui lòng điền đầy đủ thông tin trước khi tiếp tục.");
      return false;
    }
  };

  const prev = () => {
    setCurrent(current - 1);
    window.scrollTo({
      top: 10,
      behavior: "smooth",
    });
  };

  const handleAddressSelection = (addressId: number | null) => {
    setAddressSelected(addressId);
  };

  const steps = [
    {
      title: "Địa chỉ",
      content: <AddressSelect onAddressSelect={handleAddressSelection} />,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M18 6c-.047-1.553-.22-2.48-.862-3.121C16.258 2 14.842 2 12.01 2H8.007c-2.832 0-4.248 0-5.127.879C2 3.757 2 5.172 2 8v8c0 2.828 0 4.243.88 5.121C3.76 22 5.175 22 8.007 22h4.004c2.831 0 4.247 0 5.127-.879.642-.641.815-1.567.862-3.121"
          ></path>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M20.242 11.742l1.177-1.177c.27-.27.406-.406.478-.552a.992.992 0 000-.88c-.072-.146-.208-.282-.478-.552-.27-.27-.406-.406-.552-.478a.992.992 0 00-.88 0c-.146.072-.281.208-.552.478l-1.177 1.177m1.984 1.984l-5.266 5.266L12 18l.992-2.976 5.266-5.266m1.984 1.984l-1.984-1.984M5 19h1l1.25-2.5L8.5 19h1M6 6h8M6 10h6"
          ></path>
        </svg>
      ),
    },
    {
      title: "Phương thức",
      content: <SelectMethodPayment />,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
          fill="none"
          viewBox="0 0 27 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M2.452 8.25h21.245M2.453 9h21.245M5.72 14.25h6.537M5.72 16.5H8.99m-4.086 3h16.343c.65 0 1.274-.237 1.734-.659a2.16 2.16 0 00.718-1.591V6.75a2.16 2.16 0 00-.718-1.591 2.567 2.567 0 00-1.734-.659H4.903c-.65 0-1.274.237-1.733.659a2.16 2.16 0 00-.718 1.591v10.5c0 .597.258 1.169.718 1.591.46.422 1.083.659 1.733.659z"
          ></path>
        </svg>
      ),
    },
    {
      title: "Thanh toán",
      content: <OrderSummary setCurrent={setCurrent} />,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M14.98 7.016s.5.5 1 1.5c0 0 1.588-2.5 3-3M9.994 2.021c-2.498-.105-4.428.182-4.428.182-1.22.088-3.555.77-3.555 4.762 0 3.956-.026 8.834 0 10.779 0 1.188.736 3.96 3.282 4.108 3.095.18 8.67.219 11.227 0 .685-.039 2.964-.576 3.253-3.056.299-2.57.24-4.355.24-4.78"
          ></path>
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.5"
            d="M22 7.016c0 2.761-2.241 5-5.006 5a5.002 5.002 0 01-5.004-5c0-2.762 2.24-5 5.004-5a5.002 5.002 0 015.005 5zM6.98 13.016h4M6.98 17.016h8"
          ></path>
        </svg>
      ),
    },
  ];

  const items = steps.map((item, index) => ({
    key: item.title,
    title: item.title,
    icon: <CustomIcon icon={item.icon} isCompleted={current >= index} />,
  }));

  const contentStyle = {
    // lineHeight: "260px",
    // textAlign: "center",
    // color: token.colorTextTertiary,
    // backgroundColor: token.colorFillAlter,
    // borderRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
    marginTop: 20,
  };

  return (
    <React.Fragment>
      <LoadingOverlay
        active={isLoading}
        spinner
        text="Đang xử lý ..."
        className="col-span-3"
        styles={{
          overlay: (base) => ({
            ...base,
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(4px)",
          }),
          spinner: (base) => ({
            ...base,
            width: "40px",
            "& svg circle": {
              stroke: "rgba(255, 153, 0,5)",
              strokeWidth: "3px",
            },
          }),
        }}
      >
        <AddressProvider>
          <section className="my-7 space-y-7">
            <h2 className="flex gap-1.5 text-2xl text-primary font-medium">
              ĐẶT HÀNG
            </h2>
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 lg:col-span-9 steps-order">
                <Steps
                  labelPlacement="vertical"
                  current={current}
                  items={items}
                />
                <div style={contentStyle}>
                  {/* {steps[current].content} */}
                  {current === 0 && (
                    <AddressSelect onAddressSelect={handleAddressSelection} />
                  )}
                  {current === 1 && <SelectMethodPayment />}
                  {current === 2 && <OrderSummary setCurrent={setCurrent} />}
                </div>
                <div style={{ marginTop: 24 }}>
                  {current < steps.length - 1 && (
                    <Button
                      type="primary"
                      style={{ marginRight: "8px" }}
                      onClick={() => next()}
                    >
                      Tiếp tục
                    </Button>
                  )}
                  {/* {current === steps.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => message.success("Processing complete!")}
                >
                  Done
                </Button>
              )} */}
                  {current > 0 && (
                    <Button onClick={() => prev()}>Quay lại</Button>
                  )}
                </div>
              </div>
              <ConfirmOrder setIsLoading={setIsLoading} current={current} />
            </div>
          </section>
        </AddressProvider>
      </LoadingOverlay>
    </React.Fragment>
  );
};

export default CheckOutOrder;
