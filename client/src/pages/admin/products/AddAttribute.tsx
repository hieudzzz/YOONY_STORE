import { useContext, useMemo } from "react";
import { Label } from "flowbite-react";
import slugify from "react-slugify";
import { Select } from "antd";
import { useForm } from "react-hook-form";
import { IAttribute } from "../../../interfaces/IAttribute";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";
import instance from "../../../instance/instance";
import { toast } from "react-toastify";
import axios from "axios";
import { AttributeContext } from "../../../contexts/AttributeContext";

const AddAttribute = () => {
  const { dispatch } = useContext(AttributeContext);
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    setValue,
    reset,
  } = useForm<IAttribute>();

  const onSubmit = async (dataForm: IAttribute) => {
    try {
      console.log(dataForm)
      const { data } = await instance.post("attribute", dataForm);
      if (data) {
        dispatch({
          type: "ADD",
          payload: data.data,
        });
        reset();
        toast.success("Thêm thuộc tính thành công !");
      }
    } catch (error) {
      reset();
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Đã xảy ra lỗi không mong muốn");
      }
    }
  };

  const slugValue = useMemo(() => {
    setValue("slug", slugify(watch("name")));
  }, [watch("name")]);

  return (
    <div className="bg-util p-4 rounded-lg space-y-4">
      <h2 className="text-center bg-primary text-util py-2.5 rounded-[5px] font-medium">
        Thuộc tính
      </h2>
      <form action="" className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            placeholder="Tên thuộc tính"
            id="name-attribute"
            {...register("name")}
            className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Slug"
            id="slug-attribute"
            value={slugValue!}
            {...register("slug")}
            disabled
            className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] text-[#00000040] bg-gray-100 border-input rounded-[5px] w-full focus:!shadow-none"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="type-attribute" value="Type" />
          </div>
          <Select
            {...register("type")}
            onChange={(value) => setValue("type", value)}
            showSearch
            value={watch('type')}
            style={{ width: "100%",height:"35px" }}
            placeholder="Kiểu thuộc tính"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={[
              {
                value: "select",
                label: "Select",
              },
              {
                value: "color",
                label: "Color",
              },
              {
                value: "button",
                label: "Button",
              },
              {
                value: "radio",
                label: "Radio",
              },
            ]}
          />
        </div>
        <ButtonSubmit content="Add" />
      </form>
    </div>
  );
};

export default AddAttribute;
