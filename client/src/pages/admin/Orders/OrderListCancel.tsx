import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { Orders } from "../../../interfaces/IOrders";
import { IMeta } from "../../../interfaces/IMeta";
import instance from "../../../instance/instance";
import { ConfigProvider, Pagination } from "antd";
import { Table } from "flowbite-react";
import {
  checkPaymentMethod,
  status,
} from "../../../components/User/Manager/Orders/ManagerOrdersUser";
import dayjs from "dayjs";
type Props={
  activeTab:string;
  setCanceldCount:(count:number)=>void
}
const OrderListCancel = ({activeTab}:Props) => {
  const [ordersCanceled, setOrdersCanceled] = useState<Orders[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();

  useEffect(() => {
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const {
          data: { data: response },
        } = await instance.get("admin/orders?status=canceled");
        setOrdersCanceled(response.data);
        setMeta(response);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [activeTab]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff9900",
        },
      }}
    >
      <div className="space-y-5">
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
                Trạng thái
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Hành động
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {ordersCanceled.length === 0 ? (
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
                ordersCanceled.map((order, index) => {
                  return (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
                      key={order.id}
                    >
                      <Table.Cell>
                        <span className="border text-primary border-primary border-dashed py-1 px-2 rounded-sm bg-primary/10">
                          {order.code}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap font-medium text-center dark:text-white">
                        <p>{order.name}</p>
                      </Table.Cell>
                      <Table.Cell>
                        {dayjs(order.created_at).format("DD-MM-YYYY")}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap text-secondary/75">
                        <div className="flex justify-center items-center">
                          {checkPaymentMethod(order?.payment_method)}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-primary">
                          {order.final_total?.toLocaleString()}đ
                        </span>
                      </Table.Cell>
                      <Table.Cell>{status(order.status_order)}</Table.Cell>
                      <Table.Cell>
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

export default OrderListCancel;
