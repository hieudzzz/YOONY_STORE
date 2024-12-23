import { useContext, useEffect, useState } from "react";
import ProductContext from "../../../contexts/ProductContext";
import { toast } from "react-toastify";
import { IMeta } from "../../../interfaces/IMeta";
import { Link, useSearchParams } from "react-router-dom";
import instance from "../../../instance/instance";
import axios from "axios";
import { Table } from "flowbite-react";
import { Avatar, Pagination } from "antd";
import dayjs from "dayjs";
const StatisProductAdminDemo = () => {
  const { products, dispatch } = useContext(ProductContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  useEffect(() => {
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const { data } = await instance.get(`products?page=${page}`);
        dispatch({
          type: "LIST",
          payload: data.data,
        });
        setMeta(data.meta);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        } else if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("Đã xảy ra lỗi không mong muốn");
        }
      }
    })();
  }, [page]);

  return (
    <div className="p-5 rounded-md bg-util min-h-fit grid grid-cols-12 gap-5">
      <div className="space-y-5 col-span-8">
        <div className="rounded-lg overflow-auto border-b border-[#f1f1f1]">
          <Table>
            <Table.Head className="text-center">
              <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Tên sản phẩm
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Danh mục
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Chi tiết
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-dashed">
              {products.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={3}>
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
                      <p>Không có sản phẩm nào</p>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : (
                products.map((product) => {
                  return (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
                      key={product.id}
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-secondary/70 dark:text-white text-left">
                        <div className="flex gap-2">
                          <Avatar
                            shape="square"
                            src={product.images[0]}
                            size={46}
                            className="w-full"
                          />
                          <p className="max-w-[300px] w-full">
                            <Link
                              to={`/${product.category?.slug}/${product.slug}`}
                              className="block space-y-1.5"
                            >
                              <p className="hover:text-primary text-ellipsis text-nowrap overflow-hidden">
                                {product.name}
                              </p>
                              <p className="text-sm font-normal text-secondary/50">
                                Cập nhật:{" "}
                                <span className="text-primary/75">
                                  {dayjs(product.updated_at).format(
                                    "DD-MM-YYYY"
                                  )}
                                </span>
                              </p>
                            </Link>
                          </p>
                        </div>
                      </Table.Cell>
                      <Table.Cell>{product?.category?.name}</Table.Cell>
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
      <div className="col-span-4">ok</div>
    </div>
  );
};

export default StatisProductAdminDemo;
