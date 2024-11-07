import { useCallback, useContext, useState } from "react";
import { Tag, Button, message } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { RoleContext } from "../../../contexts/RoleContext";
import axios from "axios";
import instance from "../../../instance/instance";
import { useForm } from "react-hook-form";
import { IRole } from "../../../interfaces/IRole";
import UserFormModel from "./UserFormModel";
import UserRoleHasModelForm from "./UserRoleHasModelForm";
const UserRoleManager = () => {
  const { roles, dispatch } = useContext(RoleContext);
  const [inputVisible, setInputVisible] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IRole>();

  const showInput = useCallback(() => {
    setInputVisible(true);
  }, []);

  const handleInputConfirm = async (data: IRole) => {
    console.log(data);
    if (data.name.trim() === "") {
      setInputVisible(false);
      reset();
      return;
    }
    try {
      const {
        data: { data: response },
      } = await instance.post("roles", {
        name: data.name.trim(),
      });
      if (response) {
        message.success("Thêm role thành công !");
        dispatch({
          type: "ADD",
          payload: response,
        });
        reset();
        setInputVisible(false);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(
          error.response?.data?.message || "Có lỗi xảy ra khi thêm role"
        );
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Đã xảy ra lỗi không mong muốn");
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { data } = await instance.delete(`roles/${id}`);
      if (data) {
        message.success(data.message);
        dispatch({
          type: "DELETE",
          payload: id,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Đã xảy ra lỗi không mong muốn");
      }
    }
  };

  console.log(roles);

  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-9 bg-util rounded-md p-4 h-full space-y-5">
        <form className="space-y-5" onSubmit={handleSubmit(handleInputConfirm)}>
          <h2 className="text-primary font-medium">Vai trò</h2>
          <hr className="border-[#f5f5f5]" />
          <div className="flex flex-wrap gap-y-2">
            {roles.length <= 0 ? (
              <span className="text-sm text-secondary/50">
                Không có vai trò
              </span>
            ) : (
              roles.map((role) => (
                <Tag
                  key={role.id}
                  closable
                  onClose={() => handleDelete(role.id!)}
                  color="cyan"
                  closeIcon={<CloseOutlined />}
                  className="py-1 px-2.5 text-sm"
                >
                  {role.name}
                </Tag>
              ))
            )}
          </div>
          {inputVisible && (
            <input
              type="text"
              placeholder="Nhập vai trò"
              id="name-role"
              {...register("name")}
              className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] focus:!shadow-none"
            />
          )}
          {!inputVisible && (
            <Button
              icon={<PlusOutlined />}
              onClick={showInput}
              type="dashed"
              className="text-[#868686]"
            >
              Thêm vai trò
            </Button>
          )}
          <hr className="border-[#f5f5f5]" />
        </form>
        <UserFormModel />
        <hr className="border-[#f5f5f5]" />
        <UserRoleHasModelForm />
      </div>
      <div className="col-span-3">danh sach</div>
    </div>
  );
};

export default UserRoleManager;
