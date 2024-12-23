import { Table } from "flowbite-react";
import { IVoucher } from "../../../interfaces/IVouchers";
import { useContext } from "react";
import { VoucherContext } from "../../../contexts/VouchersContext";
import instance from "../../../instance/instance";
import { toast } from "react-toastify";
import Highlighter from "react-highlight-words";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { ConfigProvider, Switch } from "antd";
import dayjs from "dayjs";
type Props = {
  vouchers: IVoucher[];
  reset: (data: IVoucher) => void;
  setOpenModal: (openModal: boolean) => void;
  setStatus: (status: boolean) => void;
  setCodeVoucher: (code: string) => void;
  setIdVoucher: (id: number) => void;
  setAddOrUpdate: (property: string) => void;
  setFeatured: (is_featured: boolean) => void;
  valueSearch: string;
};

const ListVouchersAdmin = ({
  setOpenModal,
  reset,
  setStatus,
  setCodeVoucher,
  setIdVoucher,
  setAddOrUpdate,
  setFeatured,
  valueSearch,
}: Props) => {
  const { vouchers, dispatch } = useContext(VoucherContext);

  const handleRemoveVoucher = async (id: number) => {
    try {
      await instance.delete(`coupon/${id}`);
      dispatch({
        type: "DELETE",
        payload: id,
      });
      toast.success("Voucher deleted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting the voucher."
      );
    }
  };
  const handleUpdateStatus = async (id: number, statusVoucher: boolean) => {
    try {
      const { data } = await instance.patch(`coupon/${id}/status`, {
        status: statusVoucher,
      });
      dispatch({
        type: "UPDATE",
        payload: data.data,
      });
      if (statusVoucher) {
        toast.success("Hiển thị");
      } else {
        toast.warning("Ẩn");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleUpdateFeatured = async (id: number, featuredVoucher: boolean) => {
    try {
      const { data } = await instance.patch(`coupon/${id}/is_featured`, {
        is_featured: featuredVoucher,
      });
      dispatch({
        type: "UPDATE",
        payload: data.data,
      });
      if (featuredVoucher) {
        toast.success("Bật nổi bật");
      } else {
        toast.warning("Tắt nổi bật");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fillDataVoucher = async (id: number) => {
    try {
      const { data } = await instance.get(`coupon/${id}`);
      setAddOrUpdate("UPDATE");
      reset(data.data);
      setStatus(data.data.status);
      setCodeVoucher(data.data.code);
      setIdVoucher(data.data.id);
      setFeatured(data.data.is_featured);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <Table className="border-b border-[#E4E7EB]">
      <Table.Head className="text-center">
        <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
          Mã voucher
        </Table.HeadCell>
        <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
          Tên mã giảm
        </Table.HeadCell>
        <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
          Giảm giá
        </Table.HeadCell>
        <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
          Giới hạn sử dụng
        </Table.HeadCell>
        <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
          Ngày kết thúc
        </Table.HeadCell>
        <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
          Trạng thái
        </Table.HeadCell>
        <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
          Hành động
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {vouchers.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={6}>
              <div className="flex flex-col items-center text-secondary/20 space-y-2 justify-center min-h-[50vh]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-16"
                  viewBox="0 0 64 41"
                >
                  <g fill="none" fillRule="evenodd" transform="translate(0 1)">
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
                <p>Không có mã giảm giá nào</p>
              </div>
            </Table.Cell>
          </Table.Row>
        ) : (
          vouchers
            .filter((item) =>
              item?.code?.toLowerCase().includes(valueSearch.toLowerCase())
            )
            .map((voucher, index) => {
              return (
                <Table.Row
                  className="bg-white  dark:border-gray-700 dark:bg-gray-800 text-center"
                  key={voucher.id}
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-primary dark:text-white">
                    <span className="border border-dotted border-primary p-2 rounded-md">
                      <Highlighter
                        searchWords={[valueSearch.toLowerCase()]}
                        autoEscape={true}
                        textToHighlight={voucher.code}
                      />
                    </span>
                  </Table.Cell>
                  <Table.Cell>{voucher.name}</Table.Cell>
                  <Table.Cell>{ voucher.discount_type==='fixed' ? `${voucher.discount.toLocaleString()}đ`: `${voucher.discount}%`}</Table.Cell>
                  <Table.Cell>{voucher.usage_limit}</Table.Cell>
                  <Table.Cell>{voucher?.end_date ? (dayjs(voucher?.end_date).format("DD-MM-YYYY")) : "Không có"}</Table.Cell>
                  <Table.Cell>
                    <ConfigProvider
                      theme={{
                        token: {
                          colorPrimary: "#ff9900",
                        },
                      }}
                    >
                      <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={voucher.status}
                        onChange={() => {
                          handleUpdateStatus(voucher.id!, !voucher.status);
                        }}
                      />
                    </ConfigProvider>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-util shadow py-1.5 px-3 rounded-md"
                        onClick={() => {
                          setOpenModal(true);
                          fillDataVoucher(voucher.id!);
                        }}
                      >
                        <svg className="size-5" fill="none" viewBox="0 0 20 20">
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
                      {/* <button
                        className="bg-util shadow py-1.5 px-3 rounded-md"
                        onClick={() => {
                          swal({
                            title: "Bạn có muốn xóa voucher này ?",
                            text: "Sau khi xóa sẽ không thể không phục !",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                            className: "my-swal",
                          }).then((willDelete) => {
                            if (willDelete) {
                              handleRemoveVoucher(voucher.id!);
                              swal("Xóa voucher thành công !", {
                                icon: "success",
                              });
                            }
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="red"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button> */}
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })
        )}
      </Table.Body>
    </Table>
  );
};

export default ListVouchersAdmin;
