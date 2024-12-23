import { Avatar, ConfigProvider, Input, Pagination } from "antd";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { IProduct } from "../../../interfaces/IProduct";
import { IVariants } from "../../../interfaces/IVariants";
import { ISupplier } from "../../../interfaces/ISupplier";
import instance from "../../../instance/instance";
import dayjs from "dayjs";
import { IMeta } from "../../../interfaces/IMeta";
import { Link, useSearchParams } from "react-router-dom";
import { DatePicker } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { Select } from "antd";
const { RangePicker } = DatePicker;
type IHistoryInventory = {
  id?: number;
  product: IProduct;
  quantity_import_history: number;
  quantity_available: number;
  import_price: number;
  status: "Hết hàng" | "Còn hàng";
  variant: IVariants;
  supplier: ISupplier;
  created_at: string;
  updated_at: string;
};

const HistoryInventory = () => {
  const [historyInventorys, setHistoryInventory] = useState<
    IHistoryInventory[]
  >([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [valSearch, SetValSearch] = useState<string>("");
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { Search } = Input;
  useEffect(() => {
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const fromDate = dateRange ? dateRange[0] : "";
        const toDate = dateRange ? dateRange[1] : "";
        const { data } = await instance.get(
          `checkAvailableStock?from_date=${fromDate}&to_date=${toDate}&status=${statusFilter}&page=${page}`
        );
        setHistoryInventory(data.data);
        setMeta(data.pagination);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [page, dateRange, statusFilter]);

  const handleChangeStatus = (value: string) => {
    setStatusFilter(value);
  };
  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
  };
  const handleRemoveHistoryInventory = async (idHistory: number) => {
    try {
      const { data } = await instance.delete(
        `deleteHistoryRecord/${idHistory}`
      );
      if (data) {
        toast.success("Xoá lịch sử thành công");
        setHistoryInventory(
          historyInventorys.filter((historyInventory: IHistoryInventory) => {
            return historyInventory.id !== data?.deleted_record?.id;
          })
        );
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

  const checkStatus = (status: string) => {
    switch (status) {
      case "Còn hàng":
        return (
          <div className="py-1 px-3 bg-[#3CD139]/10 text-[#3CD139] rounded-full flex gap-1 w-fit text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M12 22C11.1818 22 10.4002 21.6646 8.83693 20.9939C4.94564 19.3243 3 18.4895 3 17.0853L3 7.7475M12 22C12.8182 22 13.5998 21.6646 15.1631 20.9939C19.0544 19.3243 21 18.4895 21 17.0853V7.7475M12 22L12 12.1707M21 7.7475C21 8.35125 20.1984 8.7325 18.5953 9.495L15.6741 10.8844C13.8712 11.7419 12.9697 12.1707 12 12.1707M21 7.7475C21 7.14376 20.1984 6.7625 18.5953 6M3 7.7475C3 8.35125 3.80157 8.7325 5.40472 9.495L8.32592 10.8844C10.1288 11.7419 11.0303 12.1707 12 12.1707M3 7.7475C3 7.14376 3.80157 6.7625 5.40472 6M6.33203 13.311L8.32591 14.2594"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 2V4M16 3L14.5 5M8 3L9.5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Còn hàng
          </div>
        );
      case "Hết hàng":
        return (
          <div className="py-1 px-3 bg-primary/10 text-primary rounded-full flex gap-1 w-fit text-sm">
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
            Hết hàng
          </div>
        );
      case "Bị khóa":
        return (
          <div className="py-1 px-3 bg-primary/10 text-primary rounded-full flex gap-1 w-fit text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M14.491 15.5H14.5M9.5 15.5H9.50897"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.26781 18.8447C4.49269 20.515 5.87613 21.8235 7.55966 21.9009C8.97627 21.966 10.4153 22 12 22C13.5847 22 15.0237 21.966 16.4403 21.9009C18.1239 21.8235 19.5073 20.515 19.7322 18.8447C19.879 17.7547 20 16.6376 20 15.5C20 14.3624 19.879 13.2453 19.7322 12.1553C19.5073 10.485 18.1239 9.17649 16.4403 9.09909C15.0237 9.03397 13.5847 9 12 9C10.4153 9 8.97627 9.03397 7.55966 9.09909C5.87613 9.17649 4.49269 10.485 4.26781 12.1553C4.12105 13.2453 4 14.3624 4 15.5C4 16.6376 4.12105 17.7547 4.26781 18.8447Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M7.5 9V6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5V9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Bị khoá
          </div>
        );

      default:
        break;
    }
  };
  return (
    <div className="bg-util p-5">
      <div className="space-y-7">
        <div className="flex items-center gap-5">
          <Link
            to={`/admin/products/inventory`}
            className="font-medium flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-5"
              color={"currentColor"}
              fill={"none"}
            >
              <path
                d="M3.99982 11.9998L19.9998 11.9998"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.99963 17C8.99963 17 3.99968 13.3176 3.99966 12C3.99965 10.6824 8.99966 7 8.99966 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Quay lại
          </Link>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#ff9900",
              },
            }}
          >
            <RangePicker
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              onChange={handleDateChange}
            />
            <Select
              defaultValue="Tất cả"
              style={{ width: 120 }}
              onChange={handleChangeStatus}
              options={[
                { value: "", label: "Tất cả" },
                { value: "Còn hàng", label: "Còn hàng" },
                { value: "Hết hàng", label: "Hết hàng" },
                { value: "Bị khoá", label: "Bị khoá" },
              ]}
            />
            <div className="max-w-[300px] w-full">
              <Search
                placeholder="Tìm kiếm sản phẩm, Nhà cung cấp"
                allowClear
                size="middle"
                onChange={(e) => {
                  SetValSearch(e.target.value);
                }}
              />
            </div>
          </ConfigProvider>
        </div>
        <div className={"overflow-x-auto"}>
          <Table className="border-b border-[#E4E7EB]">
            <Table.Head className="text-center">
              <Table.HeadCell
                style={{
                  width: "5%",
                }}
                className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap"
              >
                STT
              </Table.HeadCell>
              <Table.HeadCell
                style={{ width: "25%" }}
                className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap"
              >
                Hàng hoá
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Giá nhập
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-center text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Số lượng nhập
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Số lượng còn lại
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-center text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Trạng thái
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Nhà cung cấp
              </Table.HeadCell>
              <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                Ngày nhập
              </Table.HeadCell>
              {/* <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                  Hành động
                </Table.HeadCell> */}
            </Table.Head>
            <Table.Body className="divide-y">
              {historyInventorys.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={9}>
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
                      <p>Không có lần nhập hàng nào </p>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : (
                historyInventorys
                .filter(item=>{
                  return item.supplier.name.toLowerCase().includes(valSearch.toLowerCase()) || item.product.name.toLowerCase().includes(valSearch.toLowerCase())
                })
                .map((historyInventory, index) => {
                  return (
                    <Table.Row className="hover:cursor-pointer" key={index + 1}>
                      <Table.Cell className="text-center">
                        {index + 1}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <div className="flex gap-2.5">
                          <Avatar
                            shape="square"
                            src={historyInventory.product.images[0]}
                            size={45}
                          />
                          <div className="max-w-[200px] min-w-[200px] space-y-0.5">
                            <p className="text-nowrap text-ellipsis overflow-hidden">
                              {historyInventory.product.name}
                            </p>
                            <p className="text-left text-nowrap text-ellipsis overflow-hidden text-sm text-secondary/50">
                              Phân loại:{" "}
                              <span className="text-primary/75">
                                {historyInventory.variant.attribute_values
                                  .map((attribute_value) => {
                                    return attribute_value.value;
                                  })
                                  .join(" | ")}
                              </span>
                            </p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-center text-nowrap">
                        {historyInventory.import_price}đ
                      </Table.Cell>
                      <Table.Cell className="text-center text-nowrap">
                        {historyInventory.quantity_import_history}
                      </Table.Cell>
                      <Table.Cell className="text-center text-nowrap text-primary">
                        {historyInventory.quantity_available}
                      </Table.Cell>
                      <Table.Cell className="text-center text-nowrap">
                        {checkStatus(historyInventory.status)}
                      </Table.Cell>
                      <Table.Cell className="text-center text-nowrap">
                        {historyInventory.supplier.name}
                      </Table.Cell>
                      <Table.Cell className="text-center text-nowrap">
                        {dayjs(historyInventory.created_at).format(
                          "DD-MM-YYYY"
                        )}
                      </Table.Cell>
                      {/* <Table.Cell className="text-center text-nowrap">
                          <button
                            className="bg-util shadow py-1.5 px-3 rounded-md"
                            onClick={() => {
                              swal({
                                title: "Xoá lịch sử",
                                text: "Sau khi xoá không thể khôi phục!",
                                icon: "warning",
                                buttons: ["Hủy", "Xoá"],
                                dangerMode: true,
                                className: "my-swal",
                              }).then((willRemove) => {
                                if (willRemove) {
                                  handleRemoveHistoryInventory(historyInventory.id!);
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
                        </Table.Cell> */}
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
    </div>
  );
};

export default HistoryInventory;
