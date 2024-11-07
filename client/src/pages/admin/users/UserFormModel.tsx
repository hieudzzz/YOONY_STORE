import { Label, Table } from "flowbite-react";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";
import { message, Select, Popconfirm } from "antd";
import { useContext, useEffect, useState } from "react";
import instance from "../../../instance/instance";
import { IModel } from "../../../interfaces/IModel";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ModelContext } from "../../../contexts/ModelContext";
import type { PopconfirmProps } from "antd";
const UserFormModel = () => {
  const [listAllModel, setListAllModel] = useState([]);
  const { models, dispatch } = useContext(ModelContext);
  console.log(models);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<IModel>();

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { data: response },
        } = await instance.get("models1");
        setListAllModel(response);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleSubmitModel = async (dataForm: IModel) => {
    try {
      const { name, type } = dataForm;
      const {
        data: { data: response },
      } = await instance.post("models", {
        name,
        type,
      });
      if (response) {
        reset();
        message.success("Thêm model thành công !");
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

  const options = listAllModel.map((model) => ({
    value: model,
    label: model,
  }));

  const extendedOptions = [
    { value: 'admin', label: 'Admin' },
    ...options
  ];
  
  const handleRemoveModel: PopconfirmProps["onConfirm"] = async(id:number) => {
   try {
    const {data}=await instance.delete(`models/${id}`)
    console.log(data);
    if (data) {
        message.success(data.message);
        dispatch({
            type:"DELETE",
            payload:id
        })
    }
    
   } catch (error) {
    console.log(error);
   }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-primary font-medium">Thêm mới model</h2>
      <hr className="border-[#f5f5f5]" />
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="lg:w-1/3 space-y-3">
          <form onSubmit={handleSubmit(handleSubmitModel)}>
            <div className="space-y-2">
              <div className="block">
                <Label htmlFor="name-model" value="Tên model" />
              </div>
              <input
                type="text"
                placeholder="Tên model"
                id="name-model"
                {...register("name",{
                    required:"Tên model là bắt buộc !",
                    minLength:{
                        value:3,
                        message:"Tối thiểu 3 kí tự !"
                    }
                })}
                className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
              />
              <span className="text-primary text-sm block">{errors.name?.message}</span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="block">
                <Label htmlFor="type-model" value="Type" />
              </div>
              <Select
                {...register("type",{
                    required:"Vui lòng chọn type !"
                })}
                onChange={(e) => setValue("type", e)}
                showSearch
                value={watch("type")}
                style={{ width: "100%", height: "35px" }}
                placeholder="Chọn loại model"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={extendedOptions}
              />
              <span className="text-primary text-sm block">{errors.type?.message}</span>
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
                <Table.HeadCell className="text-xs bg-primary text-util text-center">STT</Table.HeadCell>
                <Table.HeadCell className="text-xs bg-primary text-util text-center">Tên Model</Table.HeadCell>
                <Table.HeadCell className="text-xs bg-primary text-util text-center">Type</Table.HeadCell>
                <Table.HeadCell className="text-xs bg-primary text-util text-center">Hành động</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {models && models.map((model, index) => (
                  <Table.Row key={model.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white border-r border-input text-center">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell className="text-center">{model.name}</Table.Cell>
                    <Table.Cell className="text-center">{model.type}</Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2 justify-center">
                        <button className="bg-util shadow py-1.5 px-2 rounded-md">
                          <svg className="size-4" fill="none" viewBox="0 0 20 20">
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
                          title="Xoá Model"
                          description="Bạn có muốn xoá model?"
                          onConfirm={() => handleRemoveModel(model.id!)}
                          okText="Xoá"
                          cancelText="Huỷ"
                        >
                          <button className="bg-util shadow py-1.5 px-2 rounded-md" type="button">
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

export default UserFormModel;


