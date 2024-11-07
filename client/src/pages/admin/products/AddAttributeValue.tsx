import { Label } from "flowbite-react";
import { Select } from "antd";
import { useForm } from "react-hook-form";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";
import instance from "../../../instance/instance";
import { toast } from "react-toastify";
import axios from "axios";
import { AttributeContext } from "../../../contexts/AttributeContext";
import { useContext } from "react";
import { IAttributeValue } from "../../../interfaces/IAttributeValue";
import { AttributeValueContext } from "../../../contexts/AttributeValueContext";

const AddAttributeValue = () => {
  const { attributes } = useContext(AttributeContext);
  const { dispatch } = useContext(AttributeValueContext);
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    setValue,
    reset,
  } = useForm<IAttributeValue>();
  //Thêm giá trị thuộc tính biến thể
  const onSubmit = async (dataForm: IAttributeValue) => {
    try {
      const {data:{data:response}} = await instance.post("attribute-value", dataForm);
      if (response) {
        dispatch({
          type:"ADD",
          payload:response
        })
        reset();
        toast.success("Thêm giá trị attribute thành công!");
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
  const options = attributes.map((attr) => ({
    value: attr.id,
    label: attr.name,
  }));
  return (
    <div className="bg-util p-4 rounded-lg space-y-4">
      <h2 className="text-center bg-primary text-util py-2.5 rounded-[5px] font-medium">
        Giá trị thuộc tính
      </h2>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="id-attribute" value="Tên" />
          </div>
          <Select
            {...register("attribute_id")}
            onChange={(e) => setValue("attribute_id", e)}
            showSearch
            value={watch("attribute_id")}
            style={{ width: "100%",height:"35px" }}
            placeholder="Tên thuộc tính"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={options}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="value-attribute" value="Giá trị" />
          </div>
          <input
            type="text"
            placeholder="Giá trị ~"
            id="value-attribute"
            {...register("value")}
            className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
          />
        </div>
        <ButtonSubmit content="Add" />
      </form>
    </div>
  );
};

export default AddAttributeValue;
