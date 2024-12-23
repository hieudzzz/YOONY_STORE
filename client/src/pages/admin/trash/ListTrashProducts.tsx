import { Table } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import TrashContext from "../../../contexts/TrashContext";
import { Avatar, Checkbox, ConfigProvider, Pagination } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import axios from "axios";
import instance from "../../../instance/instance";
import { IMeta } from "../../../interfaces/IMeta";
import type { CheckboxProps } from "antd";

const ListTrashProducts = () => {
  const { trashProducts, dispatch } = useContext(TrashContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  const [checkedList, setCheckedList] = useState<number[]>([]);

  const checkAll = trashProducts.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < trashProducts.length;

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    const allProductIds = e.target.checked
      ? trashProducts
          .map((product) => product.id)
          .filter((id): id is number => id !== undefined)
      : [];
    setCheckedList(allProductIds);
  };

  const handleCheckboxChange = (id: number) => {
    setCheckedList((prevList) =>
      prevList.includes(id)
        ? prevList.filter((itemId) => itemId !== id)
        : [...prevList, id]
    );
  };

  const handleRestoreProduct = async (id: number) => {
    try {
      const data = await instance.patch(`product/restore/${id}`);
      if (data) {
        toast.success("Khôi phục sản phẩm thành công !");
        dispatch({
          type: "DELETE",
          payload: id,
        });
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
  //khôi phục sản phẩm theo lựa chọn
  const handleRestoreMultiple = async () => {
    try {
      const { data } = await instance.post("products/restore-multiple", {
        ids: checkedList,
      });
      if (data) {
        toast.success("Đã khôi phục các sản phẩm đã chọn");
        dispatch({
          type: "DELETE_MULTIPLE",
          payload: checkedList,
        });
        setCheckedList([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //xoá cứng
//   const handleDeleteProduct = async (id:number) => {
//     try {
//       const { data } = await instance.delete(`product/hard-delete/${id}`);
//       if (data) {
//         toast.success("Đã xoá sản phẩm vĩnh viễn");
//         dispatch({
//           type: "DELETE",
//           payload: id,
//         });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

  useEffect(() => {
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const { data } = await instance.get("listDelete");
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
  }, []);

  return (
    <div className="space-y-5 bg-util p-5 rounded-md">
      <div className="rounded-lg overflow-hidden border-b border-[#f1f1f1]">
        <Table>
          <Table.Head className="text-center">
            <Table.HeadCell
              style={{ width: "5%" }}
              className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap"
            >
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#ff9900",
                  },
                }}
              >
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={onCheckAllChange}
                  checked={checkAll}
                ></Checkbox>
              </ConfigProvider>
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Tên sản phẩm
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Danh mục
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Hành động
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {trashProducts.length === 0 ? (
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
                    <p>Thùng rác rỗng</p>
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : (
              trashProducts.map((product, index) => {
                return (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
                    key={product.id}
                  >
                    <Table.Cell className="font-medium text-primary text-base border-[#f5f5f5] border-r ">
                      <ConfigProvider
                        theme={{
                          token: {
                            colorPrimary: "#ff9900",
                          },
                        }}
                      >
                        <Checkbox
                          checked={checkedList.includes(product.id!)}
                          onChange={() => handleCheckboxChange(product.id!)}
                        />
                      </ConfigProvider>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-secondary/70 dark:text-white text-left">
                      <div className="flex gap-2">
                        <Avatar
                          shape="square"
                          src={product.images[0]}
                          size={46}
                          className="w-full"
                        />
                        <p className="space-y-1 max-w-[300px] w-full">
                          <Link
                            to={`/${product.category?.slug}/${product?.slug}`}
                          >
                            <p className="text-ellipsis text-nowrap overflow-hidden">
                              {product.name}
                            </p>
                            <p className="text-sm font-normal text-secondary/50">
                              Cập nhật:{" "}
                              <span className="text-primary/75">
                                {dayjs(product.updated_at).format("DD-MM-YYYY")}
                              </span>
                            </p>
                          </Link>
                        </p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{product?.category?.name}</Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2 justify-center">
                        {/* <button
                          className="bg-util shadow py-1.5 px-3 rounded-md"
                        onClick={() => {
                            swal({
                              title: "Xoá sản phẩm vĩnh viễn",
                              text: "Sau khi xoá sản phẩm sẽ không thể khôi phục !",
                              icon: "warning",
                              buttons: ["Hủy", "Xoá vĩnh viễn"],
                              dangerMode: true,
                              className: "my-swal",
                            }).then((willDelete) => {
                              if (willDelete) {
                                handleDeleteProduct(product.id!);
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
                        </button> */}
                        <button
                          className="bg-util shadow py-1.5 px-3 rounded-md text-primary"
                          onClick={() => {
                            swal({
                              title: "Khôi phục sản phẩm",
                              text: "Sau khi khôi phục sản phẩm có thể được bán trở lại !",
                              icon: "warning",
                              buttons: ["Hủy", "Khôi phục"],
                              dangerMode: true,
                              className: "my-swal",
                            }).then((willRetore) => {
                              if (willRetore) {
                                handleRestoreProduct(product.id!);
                              }
                            });
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-6"
                            color={"currentColor"}
                            fill={"none"}
                          >
                            <path
                              d="M3.25 5H8.67963C9.34834 5 9.9728 4.6658 10.3437 4.1094L11.1563 2.8906C11.5272 2.3342 12.1517 2 12.8204 2H17.3085C18.1693 2 18.9336 2.55086 19.2058 3.36754L19.75 5M21.25 5H8.25"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M19.75 5L19.25 11.5M4.75 5L5.35461 15.5362C5.50945 18.1069 5.58688 19.3923 6.22868 20.3166C6.546 20.7736 6.9548 21.1593 7.42905 21.4492C8.01127 21.8051 8.71343 21.945 9.75 22"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M11.25 15.498L12.3863 16.9638C12.958 14.8299 15.1514 13.5636 17.2852 14.1353C18.3775 14.428 19.2425 15.1456 19.75 16.0626M21.25 20.498L20.1137 19.0343C19.5419 21.1682 17.3486 22.4345 15.2147 21.8627C14.1478 21.5769 13.2977 20.8856 12.7859 19.999"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
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
      <div
        className={`${
          checkedList.length > 0 && "flex justify-between items-center"
        }`}
      >
        {checkedList.length > 0 && (
          <button
            className="py-1.5 px-4 bg-primary text-util rounded-sm text-sm"
            onClick={handleRestoreMultiple}
          >
            Khôi phục
          </button>
        )}
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
    </div>
  );
};

export default ListTrashProducts;
