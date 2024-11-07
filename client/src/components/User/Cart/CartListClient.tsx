import { useContext, useEffect, useState } from "react";
import CartContext from "../../../contexts/CartContext";
import { Table, Pagination, Popconfirm, message } from "antd";
import type {
  PopconfirmProps,
  TableColumnsType,
  TablePaginationConfig,
} from "antd";
import { IAttributeValue } from "../../../interfaces/IAttributeValue";
import axios from "axios";
import { toast } from "react-toastify";
import instance from "../../../instance/instance";
import { Link } from "react-router-dom";
interface CartItem {
  id: string;
  variant: {
    price: number;
    sale_price?: number;
    image: string;
    product: {
      name: string;
      images: string[];
    };
    attribute_values: IAttributeValue[];
  };
  quantity: number;
}

const CartListClient = () => {
  const { carts, dispatch } = useContext(CartContext);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const pageSize = 5;

  const calculateTotal = (item: any) => {
    return item.quantity * (item.variant.sale_price || item.variant.price);
  };

  useEffect(() => {
    const newTotal = carts
      .filter((item) => selectedRowKeys.includes(item.id))
      .reduce((acc, item) => acc + calculateTotal(item), 0);
    setSelectedTotal(newTotal);
  }, [selectedRowKeys, carts]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage, selectedRowKeys]);

  const handleQuantityChange = async (
    item: any,
    newQuantity: number,
    operation: string
  ) => {
    console.log(item);
    const updatedItem = { ...item, quantity: Math.max(1, newQuantity) };
    dispatch({ type: "UPDATE", payload: updatedItem });
    try {
      if (operation === "increase") {
        await instance.patch(`cart/${item.id}/increase`);
      } else if (operation === "decrease") {
        await instance.patch(`cart/${item.id}/decrease`);
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1);
  };

  const confirmDeleteOneProduct = async (id: number) => {
    try {
      const data = await instance.delete(`cart/${id}`);

      if (data) {
        message.success("Xoá sản phẩm khỏi giỏ hàng thành công!");
        dispatch({ type: "DELETE", payload: id });
        const newTotalItems = carts.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / pageSize);
        if (currentPage > newTotalPages) {
          setCurrentPage(Math.max(1, newTotalPages));
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Đã xảy ra lỗi không mong muốn");
      }
    }
  };
  useEffect(() => {
    const totalPages = Math.ceil(carts.length / pageSize);
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [carts, currentPage, pageSize]);

  const confirmDeleteSelectProduct: PopconfirmProps["onConfirm"] = async (
    pagination: TablePaginationConfig
  ) => {
    try {
      const data = await instance.post("cart/delete-much", {
        ids: selectedRowKeys,
      });

      if (data) {
        message.success("Xoá sản phẩm khỏi giỏ hàng thành công!");
        dispatch({ type: "REMOVE_SELECTED", payload: selectedRowKeys });
        setCurrentPage(pagination.current || 1);
        setSelectedRowKeys([]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Đã xảy ra lỗi không mong muốn");
      }
    }
  };

  const cancelDeleteOneProduct: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Huỷ xoá");
  };
  // const cancelDeleteSelectProduct: PopconfirmProps["onCancel"] = (e) => {
  //   console.log(e);
  //   message.error("Huỷ xoá");
  // };

  const columns: TableColumnsType<CartItem> = [
    {
      title: "Sản phẩm",
      dataIndex: "variant",
      render: (variant, record) => (
        <div className="flex gap-3 items-center w-fit">
          <img
            src={variant.image || variant.product.images[0]}
            className="w-14 h-14 object-cover rounded-lg"
          />
          <div>
            <Link
              to={`/${variant.product.category?.slug}/${variant.product.slug}`}
              className="line-clamp-1"
            >
              {variant.product?.name}
            </Link>
            <div className="flex gap-2 text-secondary/50">
              <span>
                Size:{" "}
                {variant.attribute_values.find(
                  (item: IAttributeValue) => item.attribute.slug === "size"
                )?.value || "N/A"}
              </span>
              <span>
                Màu:{" "}
                {variant.attribute_values.find(
                  (item: IAttributeValue) => item.attribute.slug === "color"
                )?.value || "N/A"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "variant",
      align: "center",
      render: (variant, record) => (
        <span>
          {(variant.sale_price || variant.price)
            .toLocaleString("vi-VN", {
              useGrouping: true,
              maximumFractionDigits: 0,
            })
            .replace(/,/g, ".")}{" "}
          VNĐ
        </span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      align: "center",
      render: (quantity, record) => (
        <div className="flex items-center w-fit mx-auto">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleQuantityChange(
                record,
                quantity > 1 ? quantity - 1 : 1,
                "decrease"
              );
            }}
            className="p-3 border-input rounded-es-sm rounded-ss-sm text-[#929292] border-s border-b border-t"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-3"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M20 12L4 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <input
            min={1}
            value={quantity}
            onChange={(e) =>
              handleQuantityChange(record, Number(e.target.value))
            }
            className="w-10 p-[7px] border border-input outline-none text-center"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              handleQuantityChange(record, quantity + 1, "increase");
            }}
            className="p-3 border-input rounded-ee-sm rounded-se-sm text-[#929292] border-e border-t border-b"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-3"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M12 4V20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 12H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      ),
    },
    {
      title: "Tổng",
      dataIndex: "id",
      align: "center",
      render: (id, record) => (
        <span>{calculateTotal(record).toLocaleString()} VNĐ</span>
      ),
    },
    {
      title: "",
      dataIndex: "id",
      align: "center",
      render: (id, record) => (
        <button
          type="button"
          className="p-1.5 bg-uitl shadow rounded-md"
          onClick={() => {
            confirmDeleteOneProduct(id);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="size-5"
            color={"#ff9900"}
            fill={"none"}
          >
            <path
              d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M9.5 16.5L9.5 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M14.5 16.5L14.5 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ),
    },
  ];
  const paginatedData = carts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  localStorage.setItem("id_cart", JSON.stringify(selectedRowKeys));
  localStorage.setItem("final_total", JSON.stringify(selectedTotal));
  return (
    <section className="my-7 space-y-7">
      <h2 className="flex gap-1.5 text-2xl text-primary font-medium">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </span>
        GIỎ HÀNG
      </h2>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-9">
          <Table
            dataSource={paginatedData}
            rowSelection={rowSelection}
            columns={columns}
            rowKey="id"
            className="z-40 table-cart"
            pagination={false}
            onChange={handleTableChange}
          />
          <div className="flex justify-between items-center mt-5">
            <Popconfirm
              title="Xoá các sản phẩm đã chọn"
              description="Bạn có chắc chắn xoá không?"
              onConfirm={confirmDeleteSelectProduct}
              // onCancel={cancelDeleteSelectProduct}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <button
                disabled={selectedRowKeys.length === 0 ? true : false}
                className={`${
                  selectedRowKeys.length === 0
                    ? "bg-primary/50 hover:cursor-not-allowed"
                    : "bg-primary hover:cursor-pointer"
                } text-util py-1.5 px-3 rounded-sm flex items-center gap-1.5`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-5"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M16 12L8 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                Xoá mục đã chọn
              </button>
            </Popconfirm>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={carts.length}
              showSizeChanger={false}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
        <div className="col-span-3 border border-input p-3 rounded-md h-fit space-y-6 sticky top-20 bg-util">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="372.673 -803.279 3000 3000"
            >
              <path
                fill="#d7b98e"
                d="M2573.371 1531.992L2567.567 1688.696 2638.544 1678.118 2649.109 1546.41z"
                className="colord7a28e svgShape"
              ></path>
              <path
                fill="#ffae39"
                d="M2644.292 1635.745c9.303-7.884 15.23 108.024 7.32 111.646s-214.427 22.586-234.106 15.341c-19.68-7.246-23.364-45.681 8.079-54.302 31.442-8.62 97.507-24.628 116.119-51.409 0 0 11.804-34.886 16.792-38.414 4.988-3.528 8.438 22.211 8.438 22.211s55.029 13.85 77.358-5.073z"
                className="colorffc439 svgShape"
              ></path>
              <path
                fill="#f6a32c"
                d="M2445.946 1703.005c-.369 1.289 2.184 2.868 4.823 6.032 2.656 3.209 5.147 8.545 7.032 15.122 3.681 13.232 4.676 25.167 7.123 25.209 2.193.178 5.223-12.254 1.043-27.577-2.122-7.566-6.398-14.272-11.256-17.293-4.919-2.992-8.589-2.435-8.765-1.493z"
                className="colordba12c svgShape"
              ></path>
              <path
                fill="#5c3d11"
                d="M2657.094 1728.019c.496 4.042 1.736 22.036-5.474 23.946-7.208 1.91-240.762 19.003-242.508 15.9-1.746-3.103-3.032-14.982-3.949-17.211-.919-2.229 251.931-22.635 251.931-22.635z"
                className="color11405c svgShape"
              ></path>
              <path
                fill="#f6a32c"
                d="M2527.851 1692.701c5.168-6.684-8.186-20.56-11.741-19.309-3.556 1.253 6.644 25.899 11.741 19.309zm-19.711 7.839c5.168-6.683-8.186-20.559-11.741-19.308-3.555 1.251 6.645 25.899 11.741 19.308zm-20.636 6.591c5.168-6.682-8.186-20.559-11.741-19.308-3.555 1.251 6.645 25.898 11.741 19.308zm86.899-10.063c.724 11.041 10.261 19.406 21.303 18.682 11.041-.724 19.404-10.262 18.68-21.303-.724-11.041-10.261-19.405-21.302-18.681-11.041.724-19.405 10.262-18.681 21.302z"
                className="colordba12c svgShape"
              ></path>
              <path
                fill="#5c3d11"
                d="M2454.864 493.359L2557.156 1610.855 2658.373 1613.008 2791.638 478.396z"
                className="color11405c svgShape"
              ></path>
              <g className="color000000 svgShape">
                <path
                  fill="#d7b98e"
                  d="M2829.831 1589.631c.309 4.479-5.584 72.553-4.456 91.532-7.593 9.524-62.494 12.881-67.643 3.486-5.146-9.398-6.081-91.565-6.081-91.565l78.18-3.453z"
                  className="colord7a28e svgShape"
                ></path>
                <path
                  fill="#ffae39"
                  d="M2828.439 1762.7c-6.491 3.435-150.777 10.406-164.955 11.38-14.18.971-12.23-50.416 31.491-54.451l48.9-45.292c1.588-10.403 3.907-21.964 6.373-26.755 4.472-8.573 25.761-11.023 40.091-2.772 6.654 3.855 10.063 12.646 11.516 21.51 13.994-.658 24.555.255 25.989 7.914 1.99 10.603 7.129 85.026.595 88.466z"
                  className="colorffc439 svgShape"
                ></path>
                <path
                  fill="#f6a32c"
                  d="M2739.311 1739.689c-1.475-4.902-24.287-25.079-46.306-19.562 0 0 8.978-15.37 31.138-4.96 16.359 7.685 15.168 24.522 15.168 24.522zm61.42-27.402c.555 8.075 5.935 14.284 12.018 13.865 6.083-.418 10.561-7.306 10.001-15.382-.555-8.078-5.938-14.286-12.018-13.865-6.08.418-10.558 7.306-10.001 15.382zm-45.551-4.27c-6.462-3.076-37.952-2.907-31.276-7.617 6.674-4.711 30.409-1.346 32.529 4.008 2.119 5.353-1.253 3.609-1.253 3.609zm8.969-11.345c-6.462-3.079-37.953-2.907-31.279-7.618 6.679-4.714 30.412-1.351 32.531 4.006 2.121 5.352-1.252 3.612-1.252 3.612zm8.968-11.349c-6.463-3.079-37.953-2.909-31.277-7.621 6.674-4.711 30.41-1.346 32.531 4.008 2.117 5.354-1.254 3.613-1.254 3.613z"
                  className="colordba12c svgShape"
                ></path>
                <path
                  fill="#5c3d11"
                  d="M2831.355 1749.497c-.009-.109-63.374 7.314-98.935 9.573-3.973.251-7.892-9.707-43.509-7.754-24.685.994-32.491 9.372-33.295 10.296-1.508 1.73-3.559 17.278 3.492 18.026 7.052.748 167.197-8.778 169.713-11.703 4.976-5.781 2.534-18.438 2.534-18.438z"
                  className="color11405c svgShape"
                ></path>
              </g>
              <path
                fill="#7c5c2f"
                d="M2887.81 486.341L2842.557 1619.145 2740.788 1616.068 2603.932 682.306 2532.704 516.854z"
                className="color2f627c svgShape"
              ></path>
              <path
                fill="#d7b98e"
                d="M2440.715 41.226L2408.497 128.635 2179.929 384.119 2216.428 422.273 2493.479 237.52 2535.226 56.916z"
                className="colord7a28e svgShape"
              ></path>
              <path
                fill="#c1a57c"
                d="M2535.219 56.892l-41.777 180.625-277.061 184.777-36.409-38.136 119.992-134.139c16.516 20.841 41.331 51.906 45.169 55.274 5.754 4.953 94.181-43.637 96.549-58.272 2.272-14.534-13.39-15.689-27.422-22.667-13.938-7.079 21.721-3.762 29.411-14.503 7.787-10.744 11.797-86.839 6.812-94.653-3.539-5.722-20.247-16.306-29.042-21.63l19.27-52.375 94.508 15.699z"
                className="colorc18c7c svgShape"
              ></path>
              <path
                fill="#f2a433"
                d="M2514.601-108.937l-33.771 20.586s-81.18 146.721-74.306 156.516c6.874 9.796 112.419 44.418 112.419 44.418l29.559-101.056-33.901-120.464z"
                className="colorf2cd33 svgShape"
              ></path>
              <path
                fill="#f6a32c"
                d="M2531.848-2.452c-12.205 11.969-26.208 22.115-40.687 31.146-25.24 15.742-54.53 31.031-84.723 35.026-.398 2.139-.428 3.715.085 4.446 6.874 9.795 112.42 44.418 112.42 44.418l29.558-101.057-6.909-24.553c-3.073 3.643-6.29 7.186-9.744 10.574z"
                className="colordba12c svgShape"
              ></path>
              <path
                fill="#f2a433"
                d="M2419.416 541.767s443.421 32.397 479.696-22.209c36.276-54.607-172.37-648.615-197.448-657.389-25.078-8.774-187.063 28.895-187.063 28.895s-73.839 416.801-95.185 650.703z"
                className="colorf2cd33 svgShape"
              ></path>
              <path
                fill="#f6a32c"
                d="M2500.314-25.887s-42.846 309.213-49.594 314.691c-6.749 5.478 35.439-293.974 49.478-317.708m-21.685 574.282c-36.094-1.932-59.096-3.587-59.096-3.587a3519.938 3519.938 0 015.725-56.836c14.526 12.23 44.057 39.012 53.371 60.423zm420.602-25.807c-8.585 12.825-39.514 20.844-81.989 25.598 5.576-17.492 13.125-44.625 21.312-83.105 16.71-78.344-2.862-166.126-17.095-142.74-14.139 23.287-103.613 80.214-174.741 101.393-60.797 18.243-185.601 47.34-220.433 55.414a5819.053 5819.053 0 017.121-58.649c90.295-48.268 306.746-164.147 308.096-167.127 1.803-3.877 40.195-181.151 40.195-181.151l10.388 11.217c62.189 178.296 128.923 406.296 107.146 439.15z"
                className="colordba12c svgShape"
              ></path>
              <g className="color000000 svgShape">
                <path
                  fill="#5c3d11"
                  d="M2589.273-316.487s33.549 49.808 29.426 67.585c-4.124 17.776-19.414 18.832-19.414 18.832s23.685 29.858-5.137 40.576c-28.823 10.717-43.497 4.006-43.497 4.006s-74.028-108.021-37.983-131.43c36.045-23.409 44.81-45.435 76.605.431z"
                  className="color11405c svgShape"
                ></path>
                <path
                  fill="#d7b98e"
                  d="M2535.454-165.928l21.976 76.493s56.347 33.704 72.643-43.244l-51.772-88.989-42.847 55.74z"
                  className="colord7a28e svgShape"
                ></path>
                <path
                  fill="#f6a32c"
                  d="M2538.875-114.374s8.479 30.796 15.568 38.133c7.089 7.337 43.217-.858 56.382-2.164 13.166-1.306 30.187-48.509 28.44-54.274-2.897-9.56-20.216-18.947-20.216-18.947s9.386 45.715-25.602 50.261c-34.989 4.547-35.711.97-36.326-1.81-.615-2.78-12.233-32.253-12.233-32.253l-6.013 21.054z"
                  className="colordba12c svgShape"
                ></path>
                <path
                  fill="#c1a57c"
                  d="M2576.935-168.433c-5.967 13.561-20.443 43.849-28.053 46.353l-20.894-69.835 50.313-29.753s.374 49.281-1.366 53.235z"
                  className="colorc18c7c svgShape"
                ></path>
                <path
                  fill="#d7b98e"
                  d="M2439.88-292.087s1.709 168.174 62.564 159.051c49.535-7.427 101.421-67.503 84.668-121.698-6.063-19.613 7.589-79.039-37.99-82.831-45.581-3.79-109.242 45.478-109.242 45.478z"
                  className="colord7a28e svgShape"
                ></path>
                <path
                  fill="#5c3d11"
                  d="M2533.833-316.91s-135.643 96.206-133.038 24.104c2.605-72.099 45.83-56.053 45.83-56.053s-31.168-6.573-18.486-22.395c12.682-15.823 35.374 12.055 98.651-2.52 47.459-10.929 71.037 44.157 70.083 86.219-.318 14.021-6.49 44.473-9.155 34.794-3.373-12.249-8.915-30.698-18.196-34.03-1.812-.651-2.091 28.465-4.013 27.612-17.228-7.646-37.305-23.926-31.676-57.731z"
                  className="color11405c svgShape"
                ></path>
                <path
                  fill="#d7b98e"
                  d="M2569.311-280.691s5.772-10.104 18.849-8.708c14.282 1.523 8.684 38.363.613 41.005-7.793 2.552-10.686-1.275-12.507-7.39-3.118-10.476-6.955-24.907-6.955-24.907z"
                  className="colord7a28e svgShape"
                ></path>
                <path
                  fill="#5c3d11"
                  d="M2583.543-281.298c-2.954 3.766-7.229 15.078-.926 21.179 0 0-1.296-4.867.527-8.507l5.742-4.673-6.63 1.224 1.287-9.223z"
                  className="color11405c svgShape"
                ></path>
                <g className="color000000 svgShape">
                  <path
                    fill="#c1a57c"
                    d="M2544.647-225.873c1.417 3.794-2.086 8.609-7.824 10.753-5.737 2.143-11.54.809-12.957-2.985-1.417-3.792 2.083-8.606 7.824-10.753 5.738-2.143 11.538-.806 12.957 2.985zm-67.121 13.34c1.417 3.792-2.083 8.605-7.824 10.749-5.737 2.146-11.539.809-12.957-2.985-1.416-3.792 2.087-8.606 7.824-10.75 5.737-2.145 11.537-.808 12.957 2.986z"
                    className="colorc18c7c svgShape"
                  ></path>
                  <path
                    fill="#5c3d11"
                    d="M2494.606-210.709a6.215 6.215 0 01-1.739.086c-3.713-.345-5.964-4.017-6.058-4.171a1.691 1.691 0 01-.117-1.51c4.187-10.281.225-22.307.186-22.425a1.687 1.687 0 011.061-2.139 1.668 1.668 0 012.139 1.061c.18.527 4.184 12.702.083 23.898.644.777 1.767 1.813 3.032 1.925 1.178.098 2.462-.602 3.797-2.103a1.689 1.689 0 012.522 2.245c-1.566 1.756-3.209 2.806-4.906 3.133zm-17.117 25.708s20.566 4.919 39.854-9.026c6.506 7.874-14.18 35.643-39.854 9.026zm-19.487-48.135c1 5.179 4.656 8.804 8.189 8.122 3.533-.682 5.618-5.415 4.618-10.595-.991-5.139-4.696-8.797-8.229-8.115-1.566.303-2.848 1.425-3.661 3.039 1.234.137 2.238 1.025 2.479 2.27a2.845 2.845 0 01-2.268 3.353 2.94 2.94 0 01-1.346-.074c.003.667.087 1.317.218 2zm57.613-11.121c1 5.18 4.656 8.804 8.189 8.122 3.533-.681 5.578-5.407 4.578-10.586-.991-5.139-4.656-8.805-8.189-8.123-1.566.303-2.856 1.384-3.709 3.006 1.307.081 2.399.995 2.647 2.28a2.845 2.845 0 01-2.268 3.353c-.522.101-1.027.073-1.482-.13.004.665.103 1.395.234 2.078z"
                    className="color11405c svgShape"
                  ></path>
                  <path
                    fill="#c1a57c"
                    d="M2504.015-158.267c-3.276.632-5.5.558-5.733.544a1.57 1.57 0 01-1.508-1.64 1.588 1.588 0 011.641-1.514c.138.015 14.326.405 24.6-12.676.563-.67 1.542-.79 2.222-.26.681.54.801 1.536.266 2.222-7.147 9.081-15.871 12.24-21.488 13.324z"
                    className="colorc18c7c svgShape"
                  ></path>
                </g>
                <path
                  fill="#5c3d11"
                  d="M2476.583-252.915s-28.504 4.03-31.883 1.797c-3.378-2.232 4.326-9.801 17.38-9.056 13.052.744 17.716 6.538 14.503 7.259zm25.153-4.856s27.957-6.867 30.262-10.198c2.305-3.329-7.663-7.487-19.501-1.938-11.838 5.55-14.01 12.664-10.761 12.136z"
                  className="color11405c svgShape"
                ></path>
              </g>
              <g className="color000000 svgShape">
                <path
                  fill="#ffae39"
                  d="M1856.371 502.901L2058.209 345.85 2299.283 269.631 2115.207 453.184z"
                  className="colorffc439 svgShape"
                ></path>
                <path
                  fill="#f6a32c"
                  d="M2232.553 679.363L2425.621 519.562 2299.283 269.631 2100.339 424.529z"
                  className="colordba12c svgShape"
                ></path>
                <path
                  fill="#ffeacd"
                  d="M1946.686 432.626L2010.04 383.905 2227.327 323.858 2254.317 373.298 2230.758 395.316 2221.614 389.56 2224.601 402.564 2206.99 420.152 2179.973 366.289z"
                  className="colorcdeeff svgShape"
                  opacity="0.5"
                ></path>
                <path
                  fill="#ffeacd"
                  d="M2325.321 602.708L2306.119 563.472 2318.425 554.238 2323.748 557.586 2322.05 550.107 2352.696 522.773 2376.188 560.557z"
                  className="colorcdeeff svgShape"
                  opacity="0.5"
                ></path>
                <path
                  fill="#ffae39"
                  d="M1856.371 502.901L1989.206 758.145 2232.553 679.363 2100.339 424.529z"
                  className="colorffc439 svgShape"
                ></path>
                <path
                  fill="#f6a32c"
                  d="M1856.371 502.901l243.968-78.371s-67.14 42.942-118.496 57.519c-51.356 14.576-125.472 20.852-125.472 20.852z"
                  className="colordba12c svgShape"
                ></path>
              </g>
              <g className="color000000 svgShape">
                <path
                  fill="#d7b98e"
                  d="M2364.271 380.724c-25.534 5.919-45.147 21.557-52.976 28.585-13.27 11.952-46.236 68.33-46.236 68.33s6.842 5.782 10.445 6.4c5.855 1.004 14.985-5.257 22.479-14.655-3.942 7.401-9.838 21.649-9.838 21.649s9.507 4.523 13.146 4.023c4.873-.668 12.42-6.909 16.947-12.991-2.233 5.532-6.554 14.664-6.554 14.664s11.251 3.899 14.783 2.859c6.716-1.978 14.245-11.355 20.255-19.844-3.482 6.741-6.705 19.571-6.705 19.571s10.727 1.464 13.957.602c12.551-3.352 34.61-36.44 34.61-36.44 36.124 9.992 50.131-9.833 64.414-18.759 3.424-2.201-34.147-65.86-34.147-65.86s-35.528-2.592-54.58 1.866z"
                  className="colord7a28e svgShape"
                ></path>
                <path
                  fill="#c1a57c"
                  d="M2323.536 433.161c.249.26-1.359 2.152-3.792 5.314a275.544 275.544 0 00-9.118 12.665c-6.868 10.093-12.068 18.561-12.643 18.244-.566-.302 3.753-9.354 10.702-19.568 3.461-5.11 6.999-9.475 9.796-12.421 2.807-2.945 4.858-4.445 5.055-4.234zm18.315 13.884c.258.225-1.071 2.184-3.196 5.34l-8.233 12.403c-6.398 9.721-11.619 17.609-12.184 17.277-.554-.324 3.783-8.784 10.223-18.569 3.217-4.893 6.375-9.171 8.868-12.111 2.496-2.941 4.292-4.543 4.522-4.34zm16.372 15.434c.548.348-1.991 5.326-5.67 11.119s-7.106 10.207-7.654 9.86c-.548-.348 1.991-5.326 5.67-11.119 3.68-5.794 7.106-10.207 7.654-9.86z"
                  className="colorc18c7c svgShape"
                ></path>
              </g>
              <path
                fill="#d7b98e"
                d="M2668.997 60.503l7.714 146.511-270.668 181.153 46.954 56.551s304.202-121.749 340.282-148.649c36.08-26.9.45-210.742.45-210.742l-124.732-24.824z"
                className="colord7a28e svgShape"
              ></path>
              <path
                fill="#c1a57c"
                d="M2685.037 213.707c-2.543-11.522 59.341 16.347 55.732 24.313-3.607 7.968-52.573-10.005-55.732-24.313z"
                className="colorc18c7c svgShape"
              ></path>
              <path
                fill="#f2a433"
                d="M2672.292-89.438s-17.992 165.771-14.17 174.706c3.822 8.934 157.667 30.852 154.915 17.354-20.002-98.114-50.593-200.16-50.593-200.16l-60.779-40.293c-.001 0-18.77 22.471-29.373 48.393z"
                className="colorf2cd33 svgShape"
              ></path>
              <path
                fill="#f6a32c"
                d="M2813.027 102.648c2.762 13.464-151.04-8.454-154.897-17.384-1.709-3.84.723-37.121 4.006-73.657 1.667 23.072 4.612 43.847 10.104 49.592 13.937 14.691 90.919 26.476 102.597 12.851 8.034-9.385 3.77-82.337.302-126.909 10.763 38.828 26.11 97.88 37.888 155.507z"
                className="colordba12c svgShape"
              ></path>
              <g className="color000000 svgShape">
                <path
                  fill="#f6cc91"
                  d="M1823.569 1355.491L1396.231 1312.844 1429.784 698.878 1800.837 702.551z"
                  className="color91c4f6 svgShape"
                ></path>
                <path
                  fill="#ecae54"
                  d="M1800.837 702.551L1818.68 715.594 1830.029 702.841 1910.178 1309.33 1878.138 1319.299 1823.569 1355.491z"
                  className="color549bec svgShape"
                ></path>
                <path
                  fill="#ecae54"
                  d="M1531.558 787.746c.679 8.802-3.868 16.331-10.155 16.815-6.287.485-11.934-6.258-12.613-15.06-.679-8.802 3.868-16.331 10.155-16.815 6.288-.485 11.935 6.257 12.613 15.06zm143.353-4.113c.658 8.536-3.751 15.836-9.847 16.306-6.097.47-11.573-6.068-12.231-14.604-.658-8.536 3.751-15.836 9.848-16.306 6.096-.47 11.571 6.069 12.23 14.604z"
                  className="color549bec svgShape"
                ></path>
                <path
                  fill="#ffeacd"
                  d="M1513.845 788.72l-6.94 75.501c-1.988 21.62-5.026 43.517-4.135 65.269 1.601 39.112 23.037 70.587 60.363 83.78 18.935 6.693 39.405 8.004 59.295 6.242 14.898-1.32 32.344-3.965 40.775-17.936 9.557-15.837-2.301-30.112-13.74-40.92-13.384-12.646-43.173-21.765-43.676-42.902-.344-14.474 10-26.199 18.484-36.75 6.981-8.681 13.539-17.648 19.464-27.086 10.672-17.001 28.021-42.701 24.001-63.846-1.038-5.462-9.76-4.852-8.71.672 3.412 17.95-11.949 40.975-21.015 55.897-9.528 15.68-22.299 28.831-32.128 44.2-7.395 11.564-12.005 26.352-6.105 39.584 5.902 13.238 20.277 18.956 31.457 26.699 7.866 5.449 15.579 12.038 21.38 19.682 9.695 12.775 3.547 25.012-10.394 30.33-17.439 6.652-41.061 5.58-59.042 2.374-41.092-7.327-69.3-36.532-71.618-78.653-1.231-22.375 2.087-45.01 4.132-67.255l6.73-73.214c.511-5.555-8.063-7.264-8.578-1.668z"
                  className="colorcdeeff svgShape"
                ></path>
                <g className="color000000 svgShape">
                  <path
                    fill="#ffae39"
                    d="M2241.195 986.725L1958.724 926.713 1676.253 968.159 1953.75 1063.851z"
                    className="colorffc439 svgShape"
                  ></path>
                  <path
                    fill="#f6a32c"
                    d="M1946.072 1351.47L1671.152 1284.339 1676.253 968.159 1954.722 1027.412z"
                    className="colordba12c svgShape"
                  ></path>
                  <path
                    fill="#ffeacd"
                    d="M2114.8 959.872L2026.419 941.619 1776.086 987.763 1773.047 1051.293 1807.836 1062.044 1814.287 1051.687 1817.664 1066.37 1844.226 1075.553 1845.112 1007.515z"
                    className="colorcdeeff svgShape"
                    opacity="0.5"
                  ></path>
                  <path
                    fill="#ffeacd"
                    d="M1814.038 1319.344L1814.197 1270.019 1797.143 1266.708 1793.388 1272.733 1791.424 1264.299 1746.815 1251.643 1741.583 1301.608z"
                    className="colorcdeeff svgShape"
                    opacity="0.5"
                  ></path>
                  <path
                    fill="#ffae39"
                    d="M2241.195 986.725L2232.115 1311.508 1946.072 1351.47 1954.722 1027.412z"
                    className="colorffc439 svgShape"
                  ></path>
                  <path
                    fill="#f6a32c"
                    d="M2241.195 986.725l-286.473 40.687s89.377 10.516 148.733 0c59.357-10.516 137.74-40.687 137.74-40.687z"
                    className="colordba12c svgShape"
                  ></path>
                  <g className="color000000 svgShape">
                    <path
                      fill="#ffae39"
                      d="M1845.112 1062.874L1621.612 1015.39 1398.113 1048.183 1617.677 1123.897z"
                      className="colorffc439 svgShape"
                    ></path>
                    <path
                      fill="#f6a32c"
                      d="M1611.601 1351.47L1394.078 1298.354 1398.113 1048.183 1618.446 1095.065z"
                      className="colordba12c svgShape"
                    ></path>
                    <path
                      fill="#ffeacd"
                      d="M1745.104 1041.626L1675.175 1027.184 1477.104 1063.695 1474.699 1113.962 1502.225 1122.468 1507.33 1114.273 1510.001 1125.89 1531.018 1133.157 1531.719 1079.323z"
                      className="colorcdeeff svgShape"
                      opacity="0.5"
                    ></path>
                    <path
                      fill="#ffeacd"
                      d="M1507.133 1326.051L1507.259 1287.024 1493.765 1284.403 1490.794 1289.171 1489.24 1282.498 1453.944 1272.484 1449.804 1312.018z"
                      className="colorcdeeff svgShape"
                      opacity="0.5"
                    ></path>
                    <path
                      fill="#ffae39"
                      d="M1845.112 1062.874L1837.927 1319.851 1611.601 1351.47 1618.446 1095.065z"
                      className="colorffc439 svgShape"
                    ></path>
                    <path
                      fill="#f6a32c"
                      d="M1845.112 1062.874l-226.665 32.192s70.718 8.32 117.682 0c46.963-8.32 108.983-32.192 108.983-32.192z"
                      className="colordba12c svgShape"
                    ></path>
                  </g>
                </g>
                <g className="color000000 svgShape">
                  <path
                    fill="#7c5c2f"
                    d="M2314.854 889.198V861.8h-126.606l36.508-213.826h-46.042l-30.42 213.826h-205.189l14.199-213.826h-46.336l-8.11 213.826h-205.044l-8.11-213.826h-46.333l14.198 213.826H1452.38l-30.419-213.826h-46.045l36.507 213.826h-126.601v27.398H1417.1l31.036 181.775h-147.523v27.399h152.2l34.614 202.737h27.447l-28.841-202.737h187.244l13.462 202.737h27.736l-7.689-202.737h187.099l-7.69 202.737h27.736l13.463-202.737h187.244l-28.842 202.737h27.445l34.615-202.737h152.206v-27.399h-147.528l31.036-181.775h131.284zm-832.718 181.775l-25.859-181.775h203.111l12.07 181.775h-189.322zm223.61 0l-6.894-181.775h202.965l-6.894 181.775h-189.177zm412.79 0h-189.323l12.071-181.775h203.111l-25.859 181.775z"
                    className="color2f627c svgShape"
                  ></path>
                  <path
                    fill="#5c3d11"
                    d="M1204.697 676.52l113.371 615.208c4.745 25.747 27.194 44.438 53.374 44.438h857.786c26.18 0 48.629-18.691 53.374-44.438l113.371-615.208c6.146-33.352-19.46-64.109-53.374-64.109H1258.072c-33.913 0-59.52 30.757-53.375 64.109zm117.459-10.758h956.358c33.913 0 59.519 30.755 53.374 64.107l-93.701 508.511c-4.744 25.746-27.193 44.437-53.374 44.437h-768.958c-26.18 0-48.63-18.692-53.374-44.437l-93.699-508.511c-6.144-33.352 19.462-64.107 53.374-64.107z"
                    className="color11405c svgShape"
                  ></path>
                  <path
                    fill="#7c5c2f"
                    d="M2270.202 1332.943s-634.852.07-849.091.097c-40.613.007-75.657-28.421-84.06-68.154l-160.907-760.775-1.281-5.444c-6.68-28.371-31.935-48.465-61.082-48.595l-219.19-.978-2.667 53.75 215.04 1.064a17.713 17.713 0 0117.155 13.663l187.605 821.527c-61.035 18.327-105.09 75.901-102.701 143.442 2.769 78.272 69.621 139.114 147.944 139.114h592.39c.028 0 .053-.009.079-.009h56.705c17.25 0 31.127-14.435 30.213-31.884-.828-15.817-16.088-28.63-31.923-28.63h-54.768c-.103-.001-.201-.03-.305-.03h-593.271c-46.154 0-85.744-36.107-86.588-82.253-.86-47.013 36.992-85.391 83.807-85.391h915.188c15.838 0 31.097-12.815 31.923-28.632.91-17.45-12.968-31.882-30.215-31.882z"
                    className="color2f627c svgShape"
                  ></path>
                  <path
                    fill="#5c3d11"
                    d="M2072.773 1660.673c-17.44-23.714-45.543-39.019-77.284-39.019-31.742 0-59.845 15.306-77.285 39.019-11.793 15.934-18.693 35.629-18.693 56.959 0 53.07 42.907 95.976 95.978 95.976 53.07 0 96.103-42.906 96.103-95.976 0-21.33-7.026-41.025-18.819-56.959zm-77.284 114.042c-31.491 0-56.96-25.594-56.96-57.082 0-31.365 25.469-56.959 56.96-56.959 31.49 0 57.085 25.594 57.085 56.959 0 31.488-25.595 57.082-57.085 57.082z"
                    className="color11405c svgShape"
                  ></path>
                  <path
                    fill="#fff"
                    d="M2052.574 1717.633c0 31.488-25.595 57.082-57.085 57.082-31.491 0-56.96-25.594-56.96-57.082 0-31.365 25.469-56.959 56.96-56.959 31.49-.001 57.085 25.593 57.085 56.959z"
                    className="colorffffff svgShape"
                  ></path>
                  <path
                    fill="#5c3d11"
                    d="M2017 1717.626c0 11.889-9.625 21.554-21.516 21.554-11.852 0-21.441-9.665-21.441-21.554 0-11.815 9.589-21.482 21.441-21.482 11.891 0 21.516 9.667 21.516 21.482z"
                    className="color11405c svgShape"
                  ></path>
                  <g className="color000000 svgShape">
                    <path
                      fill="#5c3d11"
                      d="M1598.26 1660.673c-17.438-23.714-45.542-39.019-77.284-39.019-31.741 0-59.845 15.306-77.283 39.019-11.793 15.934-18.694 35.629-18.694 56.959 0 53.07 42.908 95.976 95.978 95.976 53.07 0 96.103-42.906 96.103-95.976 0-21.33-7.026-41.025-18.82-56.959zm-77.283 114.042c-31.491 0-56.959-25.594-56.959-57.082 0-31.365 25.468-56.959 56.959-56.959 31.491 0 56.96 25.594 56.96 56.959-.001 31.488-25.469 57.082-56.96 57.082z"
                      className="color11405c svgShape"
                    ></path>
                    <path
                      fill="#fff"
                      d="M1577.936 1717.633c0 31.488-25.468 57.082-56.96 57.082-31.491 0-56.959-25.594-56.959-57.082 0-31.365 25.468-56.959 56.959-56.959 31.492-.001 56.96 25.593 56.96 56.959z"
                      className="colorffffff svgShape"
                    ></path>
                    <path
                      fill="#5c3d11"
                      d="M1542.473 1717.626c0 11.889-9.627 21.554-21.516 21.554-11.852 0-21.441-9.665-21.441-21.554 0-11.815 9.589-21.482 21.441-21.482 11.889 0 21.516 9.667 21.516 21.482z"
                      className="color11405c svgShape"
                    ></path>
                  </g>
                  <path
                    fill="#5c3d11"
                    d="M798.262 498.716c-.428 10.298 7.714 18.611 17.791 18.329l220.934-6.197 30.995-.986c6.859-.22 11.955-8.421 10.653-17.024l-5.536-36.588c-1.001-6.609-5.484-11.513-10.751-11.692l-244.183-10.069c-9.543-.392-17.532 7.012-17.936 16.763l-1.967 47.464z"
                    className="color11405c svgShape"
                  ></path>
                </g>
              </g>
              <g className="color000000 svgShape">
                <path
                  fill="#ffeacd"
                  d="M2219.042-303.378v508.225c0 43.747-35.408 79.236-79.157 79.236h-898.034c-41.231 0-75.301-31.712-78.842-72.234 0-61.687-.315-81.595-.315-81.595v-433.632c0-43.749 35.487-79.157 79.157-79.157h898.034c43.749 0 79.157 35.408 79.157 79.157z"
                  className="colorcdeeff svgShape"
                ></path>
                <path
                  fill="#fff"
                  d="M1625.98-29.776v154.91c0 26.083-21.088 47.172-47.091 47.172H1337.01c-26.082 0-47.17-21.089-47.17-47.172V-75.439c0-26.004 21.088-47.092 47.17-47.092h205.172c-1.109 3.805-3.964 7.056-8.245 8.325-11.574 3.408-11.574 19.819 0 23.228 8.166 2.458 11.337 12.289 6.184 19.028-1.823 2.299-2.537 4.835-2.537 7.373 0 7.61 7.61 14.507 16.173 11.415 8.007-2.853 16.411 3.251 16.172 11.733-.317 12.051 15.301 17.125 22.119 7.215 2.379-3.567 6.184-5.312 9.99-5.312 3.805 0 7.61 1.744 9.988 5.312 3.489 5.073 9.198 6.183 13.954 4.438z"
                  className="colorffffff svgShape"
                ></path>
                <path
                  fill="#ffae39"
                  d="M1349.755 -27.685L1456.956 -50.46 1564.157 -34.731 1458.844 1.585z"
                  className="colorffc439 svgShape"
                ></path>
                <path
                  fill="#f6a32c"
                  d="M1461.757 110.741L1566.093 85.264 1564.157 -34.731 1458.475 -12.244z"
                  className="colordba12c svgShape"
                ></path>
                <path
                  fill="#ffeacd"
                  d="M1397.723 -37.876L1431.265 -44.803 1526.269 -27.291 1527.423 -3.18 1514.22 0.899 1511.771 -3.031 1510.49 2.541 1500.409 6.026 1500.073 -19.795z"
                  className="colorcdeeff svgShape"
                  opacity="0.5"
                ></path>
                <path
                  fill="#ffeacd"
                  d="M1511.866 98.548L1511.805 79.829 1518.277 78.572 1519.703 80.859 1520.448 77.658 1537.378 72.854 1539.364 91.817z"
                  className="colorcdeeff svgShape"
                  opacity="0.5"
                ></path>
                <path
                  fill="#ffae39"
                  d="M1349.755 -27.685L1353.2 95.574 1461.757 110.741 1458.475 -12.244z"
                  className="colorffc439 svgShape"
                ></path>
                <path
                  fill="#f6a32c"
                  d="M1349.755-27.685l108.72 15.441s-33.92 3.991-56.447 0c-22.526-3.991-52.273-15.441-52.273-15.441z"
                  className="colordba12c svgShape"
                ></path>
                <path
                  fill="#fff"
                  d="M1648.403-110.494c-5.561-1.638-7.741-8.349-4.205-12.943 5.017-6.518-1.552-15.559-9.301-12.802-5.462 1.943-11.171-2.205-11.01-7.999.228-8.222-10.401-11.675-15.049-4.89-3.276 4.782-10.333 4.782-13.609 0-4.649-6.785-15.277-3.332-15.05 4.89.161 5.794-5.548 9.942-11.01 7.999-7.749-2.757-14.318 6.284-9.301 12.802 3.536 4.594 1.354 11.305-4.205 12.943-7.89 2.325-7.89 13.5 0 15.824 5.56 1.638 7.741 8.35 4.205 12.943-5.017 6.518 1.552 15.56 9.301 12.802 5.462-1.943 11.171 2.205 11.01 7.999-.227 8.222 10.401 11.675 15.05 4.89 3.276-4.782 10.333-4.782 13.609 0 4.649 6.785 15.277 3.332 15.049-4.89-.16-5.794 5.549-9.942 11.01-7.999 7.749 2.757 14.318-6.284 9.301-12.802-3.536-4.593-1.355-11.305 4.205-12.943 7.89-2.324 7.89-13.499 0-15.824z"
                  className="colorffffff svgShape"
                ></path>
                <g className="color000000 svgShape">
                  <path
                    fill="#ffeacd"
                    d="M1600.082-84.34c-3.843-.335-8.059-1.893-10.895-4.23l3.277-4.337c2.958 2.06 5.916 3.45 9.318 3.45 4.091 0 6.106-1.78 6.106-4.782 0-7.34-17.127-6.285-17.127-16.74 0-5.171 3.654-8.844 9.321-9.731v-5.674h5.037v5.561c4.029.448 6.798 2.169 9.129 4.337l-3.715 3.727c-2.33-1.888-4.281-2.948-7.303-2.948-3.402 0-5.478 1.558-5.478 4.451 0 6.67 17.127 5.339 17.127 16.573 0 5.28-3.528 9.174-9.759 10.175v5.728h-5.037v-5.56z"
                    className="colorcdeeff svgShape"
                  ></path>
                </g>
                <g className="color000000 svgShape">
                  <path
                    fill="#fff"
                    d="M2063.556-29.776v154.91c0 26.083-21.088 47.172-47.091 47.172h-241.878c-26.082 0-47.17-21.089-47.17-47.172V-75.439c0-26.004 21.088-47.092 47.17-47.092h205.172c-1.109 3.805-3.964 7.056-8.245 8.325-11.574 3.408-11.574 19.819 0 23.228 8.166 2.458 11.337 12.289 6.184 19.028-1.823 2.299-2.537 4.835-2.537 7.373 0 7.61 7.61 14.507 16.173 11.415 8.007-2.853 16.411 3.251 16.172 11.733-.317 12.051 15.301 17.125 22.12 7.215 2.378-3.567 6.183-5.312 9.989-5.312 3.805 0 7.611 1.744 9.988 5.312 3.489 5.073 9.197 6.183 13.953 4.438z"
                    className="colorffffff svgShape"
                  ></path>
                  <path
                    fill="#ffae39"
                    d="M1787.331 -27.685L1894.532 -50.46 2001.733 -34.731 1896.42 1.585z"
                    className="colorffc439 svgShape"
                  ></path>
                  <path
                    fill="#f6a32c"
                    d="M1899.334 110.741L2003.669 85.264 2001.733 -34.731 1896.051 -12.244z"
                    className="colordba12c svgShape"
                  ></path>
                  <path
                    fill="#ffeacd"
                    d="M1835.299 -37.876L1868.841 -44.803 1963.845 -27.291 1964.999 -3.18 1951.796 0.899 1949.347 -3.031 1948.067 2.541 1937.985 6.026 1937.65 -19.795z"
                    className="colorcdeeff svgShape"
                    opacity="0.5"
                  ></path>
                  <path
                    fill="#ffeacd"
                    d="M1949.442 98.548L1949.381 79.829 1955.853 78.572 1957.279 80.859 1958.024 77.658 1974.954 72.854 1976.94 91.817z"
                    className="colorcdeeff svgShape"
                    opacity="0.5"
                  ></path>
                  <path
                    fill="#ffae39"
                    d="M1787.331 -27.685L1790.776 95.574 1899.334 110.741 1896.051 -12.244z"
                    className="colorffc439 svgShape"
                  ></path>
                  <path
                    fill="#f6a32c"
                    d="M1787.331-27.685l108.72 15.441s-33.919 3.991-56.447 0c-22.526-3.991-52.273-15.441-52.273-15.441z"
                    className="colordba12c svgShape"
                  ></path>
                  <path
                    fill="#fff"
                    d="M2085.979-110.494c-5.56-1.638-7.741-8.349-4.205-12.943 5.017-6.518-1.552-15.559-9.301-12.802-5.462 1.943-11.17-2.205-11.01-7.999.228-8.222-10.401-11.675-15.049-4.89-3.276 4.782-10.333 4.782-13.609 0-4.649-6.785-15.277-3.332-15.049 4.89.16 5.794-5.549 9.942-11.01 7.999-7.749-2.757-14.318 6.284-9.301 12.802 3.535 4.594 1.355 11.305-4.205 12.943-7.89 2.325-7.89 13.5 0 15.824 5.56 1.638 7.741 8.35 4.205 12.943-5.017 6.518 1.552 15.56 9.301 12.802 5.462-1.943 11.171 2.205 11.01 7.999-.228 8.222 10.401 11.675 15.049 4.89 3.276-4.782 10.333-4.782 13.609 0 4.649 6.785 15.277 3.332 15.049-4.89-.16-5.794 5.549-9.942 11.01-7.999 7.749 2.757 14.318-6.284 9.301-12.802-3.535-4.593-1.355-11.305 4.205-12.943 7.89-2.324 7.89-13.499 0-15.824z"
                    className="colorffffff svgShape"
                  ></path>
                  <g className="color000000 svgShape">
                    <path
                      fill="#ffeacd"
                      d="M2037.659-84.34c-3.843-.335-8.06-1.893-10.895-4.23l3.277-4.337c2.958 2.06 5.917 3.45 9.318 3.45 4.091 0 6.106-1.78 6.106-4.782 0-7.34-17.126-6.285-17.126-16.74 0-5.171 3.653-8.844 9.321-9.731v-5.674h5.037v5.561c4.03.448 6.798 2.169 9.129 4.337l-3.715 3.727c-2.33-1.888-4.281-2.948-7.303-2.948-3.402 0-5.478 1.558-5.478 4.451 0 6.67 17.127 5.339 17.127 16.573 0 5.28-3.528 9.174-9.76 10.175v5.728h-5.037v-5.56z"
                      className="colorcdeeff svgShape"
                    ></path>
                  </g>
                </g>
                <g className="color000000 svgShape">
                  <path
                    fill="#fff"
                    d="M1422.28-233.767h-26.237l-4.341 12.552h-13.87l23.686-65.964h15.384l23.686 65.964h-13.969l-4.339-12.552zm-13.12-38.124l-9.529 27.555h19.061l-9.532-27.555zm98.086 17.835c0 19.913-13.681 32.842-34.728 32.842h-23.025v-65.871h23.025c21.047-.001 34.728 13.024 34.728 33.029zm-35.2 21.611c13.873 0 21.707-7.926 21.707-21.611 0-13.681-7.834-21.892-21.707-21.892h-9.34v43.503h9.34zm102.901-21.611c0 19.913-13.685 32.842-34.728 32.842h-23.026v-65.871h23.026c21.042-.001 34.728 13.024 34.728 33.029zm-35.201 21.611c13.873 0 21.707-7.926 21.707-21.611 0-13.681-7.834-21.892-21.707-21.892h-9.34v43.503h9.34zm64.127-54.641h48.318v10.666h-17.555v55.206h-13.208v-55.206h-17.555v-10.666zm88.548 66.533c-18.592 0-33.783-13.966-33.783-33.783 0-19.725 15.192-33.691 33.783-33.691 18.78 0 33.691 13.966 33.691 33.691 0 19.817-15.008 33.783-33.691 33.783zm0-11.796c11.891 0 20.101-8.591 20.101-21.988 0-13.4-8.211-21.799-20.101-21.799-11.983 0-20.194 8.399-20.194 21.799 0 13.397 8.211 21.988 20.194 21.988zm96.215-55.586c14.627 0 26.518 7.833 30.952 21.327h-15.191c-3.116-6.321-8.78-9.436-15.857-9.436-11.511 0-19.721 8.399-19.721 21.8 0 13.304 8.21 21.799 19.721 21.799 7.077 0 12.74-3.116 15.857-9.532h15.191c-4.433 13.589-16.325 21.327-30.952 21.327-18.968 0-33.406-13.87-33.406-33.595 0-19.72 14.439-33.69 33.406-33.69zm82.708 54.168h-26.238l-4.341 12.552h-13.87l23.687-65.964h15.383l23.686 65.964h-13.969l-4.338-12.552zm-13.12-38.124l-9.528 27.555h19.06l-9.532-27.555zm65.056-15.195c15.856 0 23.783 9.155 23.783 20.197 0 8.022-4.434 16.137-15.007 18.968l15.76 26.706h-15.288l-14.53-25.669h-6.228v25.669h-13.213v-65.871h24.723zm-.472 10.95h-11.038v19.344h11.038c7.361 0 10.665-3.869 10.665-9.816 0-5.847-3.304-9.528-10.665-9.528zm32.78-10.95h48.318v10.666h-17.554v55.206h-13.209v-55.206h-17.555v-10.666z"
                    className="colorffffff svgShape"
                  ></path>
                </g>
              </g>
              <g className="color000000 svgShape">
                <path
                  fill="#ffae39"
                  d="M2874.72-344.822l-90.331 25.819-1.278 41.742 49.233 172.384 12.244-3.45 90.296-25.821 12.216-3.499-49.282-172.354-23.098-34.821zm-37.014 41.572c-5.297 1.517-10.803-1.596-12.339-6.869-1.505-5.335 1.532-10.897 6.885-12.424 5.272-1.503 10.877 1.553 12.417 6.889 1.471 5.333-1.609 10.877-6.963 12.404z"
                  className="colorffc439 svgShape"
                ></path>
                <path
                  fill="#f6a32c"
                  d="M2845.133-254.198l-2.031-7.078 12.259-3.48 2.08 7.048c11.266-.809 19.073 5.802 22.739 18.771l.881 2.974-14.229 4.083-1.156-3.947c-1.932-6.852-5.417-8.68-10.164-7.288-4.775 1.344-6.761 4.724-4.839 11.56 5.62 19.633 35.291 12.199 43.068 39.577 3.67 12.923.451 22.885-9.564 28.087l2.009 6.981-12.3 3.526-2.018-6.998c-11.412.895-19.212-5.872-22.911-18.844l-1.829-6.563 14.14-4.01 2.133 7.476c1.981 6.823 5.68 8.459 10.428 7.067 4.8-1.359 7.119-4.671 5.163-11.508-5.614-19.681-35.275-12.23-43.039-39.529-3.69-12.844-.692-22.568 9.18-27.905z"
                  className="colordba12c svgShape"
                ></path>
                <g className="color000000 svgShape">
                  <path
                    fill="#f2a433"
                    d="M2100.128-420.167l-3.786 180.774s119.633 36.677 122.947 31.957c3.315-4.72 44.227-182.104 44.227-182.104l-163.388-30.627z"
                    className="colorf2cd33 svgShape"
                  ></path>
                  <path
                    fill="#f6a32c"
                    d="M2169.76-352.712c8.223 2.004 12.367 8.333 8.315 17.433-3.966 9.121-12.201 12.433-20.425 10.429-8.31-2.025-12.453-8.354-8.488-17.476 4.053-9.1 12.374-12.39 20.598-10.386zm27.403 7.596l14.283 3.481-59.001 50.182-14.284-3.481 59.002-50.182zm-37.7 5.301c-1.663 3.813-.894 5.926 1.703 6.559s5.031-.699 6.693-4.512c1.663-3.813.807-5.947-1.789-6.58s-4.944.72-6.607 4.533zm32.669 28.137c8.224 2.004 12.28 8.312 8.229 17.413-3.965 9.121-12.201 12.433-20.425 10.429-8.224-2.004-12.367-8.333-8.315-17.434 3.965-9.121 12.287-12.412 20.511-10.408zm-10.383 12.877c-1.663 3.813-.894 5.926 1.789 6.58 2.511.612 4.945-.72 6.608-4.534 1.663-3.813.807-5.947-1.702-6.559-2.599-.633-5.032.699-6.695 4.513z"
                    className="colordba12c svgShape"
                  ></path>
                </g>
              </g>
            </svg>
          </div>
          <div className="space-y-2">
            <p className="font-medium">
              Tổng thanh toán:{" "}
              <span className="text-primary">
                {selectedTotal.toLocaleString()} VNĐ
              </span>
            </p>
          </div>
          <button
            className={`${
              selectedRowKeys.length <= 0
                ? "bg-[#D1D1D6] pointer-events-none"
                : "bg-primary pointer-events-auto"
            } w-full block rounded-sm`}
          >
            <Link
              to={"/check-out"}
              className={`text-center flex justify-center py-2 text-util`}
            >
              TIẾN HÀNH ĐẶT HÀNG
            </Link>
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
      </div>
    </section>
  );
};

export default CartListClient;
