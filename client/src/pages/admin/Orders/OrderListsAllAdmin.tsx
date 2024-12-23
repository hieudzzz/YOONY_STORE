import { ConfigProvider, Pagination } from "antd";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import instance from "../../../instance/instance";
import { Orders } from "../../../interfaces/IOrders";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import {
  checkPaymentMethod,
  status,
} from "../../../components/User/Manager/Orders/ManagerOrdersUser";
import { NavLink, useSearchParams } from "react-router-dom";
import { IMeta } from "../../../interfaces/IMeta";
type Prop = {
  setListAllCount: (count: number) => void;
};
const OrderListsAllAdmin = ({ setListAllCount }: Prop) => {
  const [valSearch, SetValSearch] = useState<string>("");
  const [orders, setOrders] = useState<Orders[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();

  useEffect(() => {
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const {
          data: { data: response },
        } = await instance.get(`admin/orders?page=${page}`);
        setOrders(response.data);
        setListAllCount(response.data.length);
        setMeta(response);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [page]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff9900",
        },
      }}
    >
      <div className="space-y-5">
        <div className="flex items-center gap-1 bg-[#F4F7FA] px-4 rounded-sm py-1 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="size-5 text-secondary/50"
            color={"currentColor"}
            fill={"none"}
          >
            <path
              d="M14 14L16.5 16.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M16.4333 18.5252C15.8556 17.9475 15.8556 17.0109 16.4333 16.4333C17.0109 15.8556 17.9475 15.8556 18.5252 16.4333L21.5667 19.4748C22.1444 20.0525 22.1444 20.9891 21.5667 21.5667C20.9891 22.1444 20.0525 22.1444 19.4748 21.5667L16.4333 18.5252Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16C12.866 16 16 12.866 16 9Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="search"
            onChange={(e) => {
              SetValSearch(e.target.value);
            }}
            placeholder="Bạn có thể tìm kiếm theo Mã đơn hàng hoặc Tên người đặt,Phương thức thanh toán"
            className="block focus:!border-none bg-[#F4F7FA] placeholder:text-[#a3a3a3] h-[35px] text-sm border-none rounded-[5px] w-full focus:!shadow-none"
          />
        </div>
        <div className="overflow-x-auto rounded-lg">
          <Table className="border-b border-[#E4E7EB]">
            <Table.Head className="text-center">
              {/* <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                STT
              </Table.HeadCell> */}
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Mã đơn hàng
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Người đặt
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Ngày đặt
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Phương thức
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Tổng tiền
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Lợi nhuận
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Trạng thái
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Thông tin giao hàng
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Hành động
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {orders.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={8}>
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
                orders
                  .filter((item) => {
                    return (
                      item.code
                        .toLowerCase()
                        .includes(valSearch.toLowerCase()) ||
                      item.name
                        .toLowerCase()
                        .includes(valSearch.toLowerCase()) ||
                      item.payment_method
                        .toLowerCase()
                        .includes(valSearch.toLowerCase())
                    );
                  })
                  .map((order, index) => {
                    return (
                      <Table.Row
                        className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
                        key={order.id}
                      >
                        {/* <Table.Cell
                        style={{ width: "5%" }}
                        className="font-medium text-primary text-base border-[#f5f5f5] border-r "
                      >
                        {index + 1}
                      </Table.Cell> */}
                        <Table.Cell>
                          <span className="border text-primary border-primary border-dashed py-1 px-2 rounded-sm bg-primary/10 block text-nowrap">
                            {order.code}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-medium text-center block items-center dark:text-white text-nowrap">
                          <Highlighter
                            highlightClassName="YourHighlightClass"
                            searchWords={[valSearch.toLowerCase()]}
                            autoEscape={true}
                            textToHighlight={order.name}
                          />
                        </Table.Cell>
                        <Table.Cell>
                          <p className="block text-nowrap">
                            {dayjs(order.created_at).format("DD-MM-YYYY H:ss")}
                          </p>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex justify-center items-center">
                            {checkPaymentMethod(order.payment_method)}
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <p className="text-primary block text-nowrap">
                            {order.final_total?.toLocaleString()}đ
                          </p>
                        </Table.Cell>
                        <Table.Cell>
                          <span
                            className={`${
                              order?.profit > 0
                                ? "text-[#22A949]"
                                : "text-red-400"
                            }`}
                          >
                            {order.profit?.toLocaleString()}đ
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <p className="block text-nowrap">
                            {status(order.status_order)}
                          </p>
                        </Table.Cell>
                        <Table.Cell>
                          <p className="block text-nowrap">
                            {order.status_order === "shipping" && (
                              <>
                                {order.is_delivered === null && (
                                  <p>Chưa có thông tin</p>
                                )}
                                {Array(order?.is_delivered).length === 1 && (
                                  <p className="text-primary/75">
                                    Đang chờ người dùng xác nhận
                                  </p>
                                )}
                                {Array(order?.is_delivered).length === 2 && (
                                  <p className="text-[#33C8DB]">
                                    Giao hàng thành công
                                  </p>
                                )}
                              </>
                            )}
                          </p>
                        </Table.Cell>
                        <Table.Cell>
                          <p className="block text-nowrap">
                            <NavLink
                              to={`orderDetails/${order.code}`}
                              className="text-util bg-primary hover:text-util py-1.5 px-2 flex items-center justify-center flex-nowrap gap-1 rounded-sm"
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
                          </p>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
              )}
            </Table.Body>
          </Table>
        </div>
        <Pagination
          current={page}
          onChange={(page) => {
            setSearchParams({ page: String(page) });
          }}
          total={meta?.total || 0}
          pageSize={meta?.per_page || 10}
          showSizeChanger={false}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`
          }
          align="end"
        />
      </div>
    </ConfigProvider>
  );
};

export default OrderListsAllAdmin;
