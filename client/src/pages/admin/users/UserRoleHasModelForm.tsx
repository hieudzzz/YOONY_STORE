import { Label, Table } from "flowbite-react";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";
import { message, Select, Popconfirm } from "antd";
import { useContext, useState } from "react";
import instance from "../../../instance/instance";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ModelContext } from "../../../contexts/ModelContext";
import type { PopconfirmProps } from "antd";
import { RoleContext } from "../../../contexts/RoleContext";
import { IRoleHasModel } from "../../../interfaces/IRoleHasModel";
import { RoleHasModelContext } from "../../../contexts/RoleHasModelContext";
const UserRoleHasModelForm = () => {
  const { roles } = useContext(RoleContext);
  const { models } = useContext(ModelContext);
  const { role_has_models, dispatch } = useContext(RoleHasModelContext);
  const [data, setData] = useState<IRoleHasModel[]>([])
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<IRoleHasModel>();

  const handleSubmitModel = async (dataForm: IRoleHasModel) => {
    try {
      console.log(dataForm);
      const { role_id, model_id } = dataForm;
      const {
        data: { data: response },
      } = await instance.post("role-assign-model", {
        role_id,
        model_id,
      });
      console.log(response);
      if (response) {
        reset();
        message.success("Phân quyền thành công !");
        dispatch({
          type: "ADD",
          payload: response,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(
          error.response?.data?.message || "Có lỗi xảy ra khi thêm model"
        );
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Đã xảy ra lỗi không mong muốn");
      }
    }
  };

  console.log(models);

  const optionsRole = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const optionsModel = models.map((model) => ({
    value: model.id,
    label: model.name,
  }));



  const handleRemoveRoleHasModel: PopconfirmProps["onConfirm"] = async (
    role_id: number
  ) => {
    try {
      const { data } = await instance.delete(`role-assign-model/${role_id}`);
      console.log(data);
      if (data) {
        message.success(data.message);
        dispatch({
          type: "DELETE",
          payload: role_id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowDetailModelsInnerRole=(id:number)=>{
    const dataRoleHasModel=role_has_models.filter((role_has_model)=>{
        return role_has_model.id === id
    })
    setData(dataRoleHasModel)
    console.log(dataRoleHasModel[0].role?.models);
  }


  return (
    <div className="space-y-5">
      <h2 className="text-primary font-medium">Phân quyền cho vai trò</h2>
      <hr className="border-[#f5f5f5]" />
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="lg:w-1/3 space-y-3">
          <form onSubmit={handleSubmit(handleSubmitModel)}>
            <div className="mt-3 space-y-2">
              <div className="block">
                <Label htmlFor="role-id" value="Vai trò" />
              </div>
              <Select
                {...register("role_id", {
                  required: "Vui lòng chọn vai trò !",
                })}
                onChange={(e) => setValue("role_id", e)}
                showSearch
                value={watch("role_id")}
                style={{ width: "100%", height: "35px" }}
                placeholder="Chọn vai trò"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={optionsRole}
              />
              <span className="text-primary text-sm block">
                {errors.role_id?.message}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="block">
                <Label htmlFor="model-id" value="Model" />
              </div>
              <Select
                mode="multiple"
                allowClear
                {...register("model_id", {
                  required: "Vui lòng chọn model !",
                })}
                onChange={(e) => setValue("model_id", e)}
                showSearch
                value={watch("model_id")}
                style={{ width: "100%", height: "35px" }}
                placeholder="Chọn các model"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={optionsModel}
              />
              <span className="text-primary text-sm block">
                {errors.model_id?.message}
              </span>
            </div>
            <div className="mt-3">
              <ButtonSubmit content="Thêm" />
            </div>
          </form>
        </div>
        <div className="lg:w-2/3">
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="text-xs bg-primary text-util text-center">
                  STT
                </Table.HeadCell>
                <Table.HeadCell className="text-xs bg-primary text-util text-center">
                  Vai trò
                </Table.HeadCell>
                <Table.HeadCell className="text-xs bg-primary text-util text-center">
                  Model
                </Table.HeadCell>
                <Table.HeadCell className="text-xs bg-primary text-util text-center">
                  Hành động
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {role_has_models &&
                  role_has_models.map((role_has_model, index) => (
                    <Table.Row
                      key={role_has_model.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white border-r border-input text-center">
                        {index + 1}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        {role_has_model?.role?.name}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <button className="flex items-center gap-2 text-primary mx-auto" onClick={()=>{
                            handleShowDetailModelsInnerRole(role_has_model?.role?.id as number)
                        }} >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-6"
                            color={"currentColor"}
                            fill={"none"}
                          >
                            <path
                              d="M12 22L10 16H2L4 22H12ZM12 22H16"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 13V12.5C12 10.6144 12 9.67157 11.4142 9.08579C10.8284 8.5 9.88562 8.5 8 8.5C6.11438 8.5 5.17157 8.5 4.58579 9.08579C4 9.67157 4 10.6144 4 12.5V13"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M19 13C19 14.1046 18.1046 15 17 15C15.8954 15 15 14.1046 15 13C15 11.8954 15.8954 11 17 11C18.1046 11 19 11.8954 19 13Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M10 4C10 5.10457 9.10457 6 8 6C6.89543 6 6 5.10457 6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M14 17.5H20C21.1046 17.5 22 18.3954 22 19.5V20C22 21.1046 21.1046 22 20 22H19"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          Chi tiết
                        </button>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-2 justify-center">
                          <button className="bg-util shadow py-1.5 px-2 rounded-md">
                            <svg
                              className="size-4"
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
                          <Popconfirm
                            title="Xoá Quyền"
                            description="Bạn có muốn xoá quyền?"
                            onConfirm={() => handleRemoveRoleHasModel(role_has_model.id!)}
                            okText="Xoá"
                            cancelText="Huỷ"
                          >
                            <button
                              className="bg-util shadow py-1.5 px-2 rounded-md"
                              type="button"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="size-4"
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
                          </Popconfirm>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoleHasModelForm;
