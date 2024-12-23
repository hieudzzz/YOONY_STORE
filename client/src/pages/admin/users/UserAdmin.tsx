import { Table } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import instance from "../../../instance/instance";
import { IMeta } from "../../../interfaces/IMeta";
import { useSearchParams } from "react-router-dom";
import {
  Avatar,
  ConfigProvider,
  Modal,
  Pagination,
  Radio,
  RadioChangeEvent,
  Space,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { IUser } from "../../../interfaces/IUser";
import { useForm } from "react-hook-form";

const UserAdmin = () => {
  const { users, dispatch } = useContext(UserContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  const [openModal, setOpenModal] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm<IUser>();
  const [selectedUserId, setSelectedUserId] = useState<number>();

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setSearchParams({ page: String(page) });
      const { data } = await instance.get("users");
      dispatch({
        type: "LIST",
        payload: data.data,
      });
      setMeta(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải danh sách người dùng");
    }
  };

  const handleUpdateRoleUser = async () => {
    try {
      if (!selectedUserId) {
        toast.error("Không tìm thấy người dùng");
        return;
      }

      const {
        data: { data: response },
      } = await instance.patch(`users/${selectedUserId}/role`, {
        role: watch("role"),
      });

      if (response) {
        dispatch({
          type: "UPDATE",
          payload: response,
        });
        toast.success("Cập nhật quyền thành công!");
        setOpenModal(false);
        fetchUsers();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const getDataUser = async (id: number) => {
    try {
      const { data } = await instance.get(`user/${id}`);
      reset({
        role: data.role,
      });
      setSelectedUserId(id);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể tải thông tin người dùng"
      );
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    reset();
  };

  const onChange = (e: RadioChangeEvent) => {
    setValue("role", e.target.value);
  };

  return (
    <div className="bg-util p-5 rounded-md space-y-5">
      <div className="overflow-x-auto">
        <Table className="border-b border-[#E4E7EB]">
          <Table.Head className="text-center">
            <Table.HeadCell
              className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap"
              style={{ width: "20%" }}
            >
              Người dùng
            </Table.HeadCell>
            <Table.HeadCell
              style={{ width: "20%" }}
              className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap"
            >
              Email
            </Table.HeadCell>
            <Table.HeadCell
              style={{ width: "10%" }}
              className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap"
            >
              Số điện thoại
            </Table.HeadCell>
            <Table.HeadCell
              style={{ width: "10%" }}
              className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap"
            >
              Truy cập
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Quyền
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Phân quyền
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users.length === 0 ? (
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
                    <p>Không có người dùng nào</p>
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : (
              users?.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="large"
                        src={user.avatar}
                        icon={<UserOutlined />}
                      />
                      <p className="line-clamp-1">{user.name}</p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.tel || "Không có"}</Table.Cell>
                  <Table.Cell className="text-center">
                    {user.provider === "google" ? "Google" : "Email"}
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    {user.role === "admin"
                      ? "Quản trị"
                      : user.role === "manage"
                      ? "Quản lý & Nhân viên"
                      : "Người dùng"}
                  </Table.Cell>
                  <Table.Cell>
                    <button
                      className={`${user.role==='admin' ? 'text-secondary/40 hover:cursor-not-allowed' : 'text-primary hover:cursor-pointer'} flex items-center mx-auto gap-1.5`}
                      onClick={() => {
                        setOpenModal(true);
                        getDataUser(user.id!);
                      }}
                      disabled={user.role==='admin'}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                        />
                      </svg>
                      Cập nhật
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </div>
      <Modal
        title="Phân quyền"
        open={openModal}
        onCancel={handleCancel}
        width={500}
        okText="Cập nhật"
        cancelText="Trở lại"
        onOk={handleSubmit(handleUpdateRoleUser)}
      >
        <form>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#ff9900",
              },
            }}
          >
            <Radio.Group onChange={onChange} value={watch("role")}>
              <Space direction="vertical">
                <Radio value="admin">Quản trị</Radio>
                <Radio value="manage">Quản lý & Nhân viên</Radio>
                <Radio value={null}>Người dùng</Radio>
              </Space>
            </Radio.Group>
          </ConfigProvider>
        </form>
      </Modal>
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

export default UserAdmin;
