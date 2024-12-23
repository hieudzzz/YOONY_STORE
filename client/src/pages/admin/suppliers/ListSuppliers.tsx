import { Table } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import instance from "../../../instance/instance";
import { SupplierContext } from "../../../contexts/SupplierContext";
import { useSearchParams } from "react-router-dom";
import { IMeta } from "../../../interfaces/IMeta";
import { ConfigProvider, Pagination } from "antd";
import { Input } from "antd";
import Highlighter from "react-highlight-words";
import axios from "axios";
import { toast } from "react-toastify";
const ListSuppliers = () => {
  const { suppliers, dispatch } = useContext(SupplierContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  const { Search } = Input;
  const [valSearch, SetValSearch] = useState<string>("");
  useEffect(() => {
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const {
          data: { data: response },
        } = await instance.get(`suppliers?page=${page}`);
        if (response) {
          dispatch({
            type: "LIST",
            payload: response.data,
          });
          setMeta(response);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [page]);
  const handleUpdateSupplier = (idSupplier: number) => {
    setSearchParams({ id: String(idSupplier) });
  };
  const handleDeleteSuppliers=async(id:number)=>{
    try {
      await instance.delete(`delete-supplier/${id}`)
      dispatch({
        type: "DELETE",
        payload: id
      });
      toast.success('Xoá nhà cung cấp thành công !')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Đã xảy ra lỗi không mong muốn");
      }
    }
  }
  return (
    <div className="bg-util p-5 rounded-md space-y-5 col-span-9 h-fit">
      <div className="w-fit ml-auto">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#ff9900",
            },
          }}
        >
          <Search
            placeholder="Tên nhà cung cấp"
            allowClear
            onChange={(e) => {
              SetValSearch(e.target.value);
            }}
            size="large"
          />
        </ConfigProvider>
      </div>
      <div className="overflow-x-auto">
        <Table className="border-b border-[#E4E7EB]">
          <Table.Head className="text-center">
            <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Tên cung cấp
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Số điện thoại
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Email
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Địa chỉ
            </Table.HeadCell>
            <Table.HeadCell
              className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap"
              style={{
                width: "20%",
              }}
            >
              Hành động
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {suppliers?.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={6}>
                  <div className="flex flex-col items-center text-secondary/20 space-y-2 justify-center min-h-[10vh]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-14"
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
                    <p>Không có nhà cung cấp nào</p>
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : (
              suppliers
                .filter((item) =>
                  item.name.toLowerCase().includes(valSearch.toLowerCase())
                )
                ?.map((supplier) => {
                  return (
                    <Table.Row key={supplier?.id}>
                      <Table.Cell>
                        <p className="text-nowrap text-ellipsis overflow-hidden max-w-[170px]">
                          <Highlighter
                            highlightClassName="YourHighlightClass"
                            searchWords={[valSearch.toLowerCase()]}
                            autoEscape={true}
                            textToHighlight={supplier.name}
                          />
                        </p>
                      </Table.Cell>
                      <Table.Cell>{supplier.phone}</Table.Cell>
                      <Table.Cell>{supplier?.email || "Không có"}</Table.Cell>
                      <Table.Cell>
                        <p className="text-nowrap text-ellipsis overflow-hidden max-w-[170px]">
                          {supplier?.address || "Không có"}
                        </p>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-2 justify-center">
                          <button
                            className="bg-util shadow py-1.5 px-3 rounded-md"
                            onClick={() => handleUpdateSupplier(supplier.id)}
                          >
                            <svg
                              className="size-5"
                              fill="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                stroke="#1FD178"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit="10"
                                strokeWidth="1.5"
                                d="M11.05 3l-6.842 7.242c-.258.275-.508.816-.558 1.191l-.308 2.7c-.109.975.591 1.642 1.558 1.475l2.683-.458c.375-.067.9-.342 1.159-.625l6.841-7.242c1.184-1.25 1.717-2.675-.125-4.416C13.625 1.142 12.233 1.75 11.05 3zM9.908 4.208A5.105 5.105 0 0014.45 8.5M2.5 18.333h15"
                              ></path>
                            </svg>
                          </button>
                          <button
                            className="bg-util shadow py-1.5 px-3 rounded-md"
                            onClick={() => {
                              swal({
                                title: "Xoá nhà cung cấp",
                                text: "Sau khi xoá nhà cung cấp không thể khôi phục !",
                                icon: "warning",
                                buttons: ["Hủy", "Xoá"],
                                dangerMode: true,
                                className: "my-swal",
                              }).then((willDelte) => {
                                if (willDelte) {
                                  handleDeleteSuppliers(supplier.id!);
                                }
                              });
                              
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="size-5"
                              color={"#F31260"}
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
                        </div>
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
        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
        align="end"
      />
    </div>
  );
};

export default ListSuppliers;
