import { Select } from "antd";
import { Label, ToggleSwitch } from "flowbite-react";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";
import { useForm } from "react-hook-form";
import { IEvent } from "../../../interfaces/IEvent";
import instance from "../../../instance/instance";
import { useContext, useState } from "react";
import { IVoucher } from "../../../interfaces/IVouchers";
import EventContext from "../../../contexts/EventContext";
import { toast } from "react-toastify";
const EventAddOrUpdateForm = () => {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    setValue,
    reset,
  } = useForm<IEvent>({
    defaultValues: {
      is_active: true,
    },
  });
  const [counponLists, setCounponList] = useState<IVoucher[]>([]);
  const { dispatch } = useContext(EventContext);

  const onSubmitEvent = async (dataForm: IEvent) => {
    try {
      const { data } = await instance.post("admin/events", dataForm);
      console.log(data);
      if (data) {
        toast.success("Tạo sự kiện thành công !");
        dispatch({
          type: "ADD",
          payload: data.event,
        });
      }
      console.log(dataForm);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleGetListVoucherEvent = async () => {
    try {
      const { data } = await instance.get("admin/coupons/events");
      setCounponList(data.event_coupons);
    } catch (error) {
      console.log(error);
    }
  };

  const optionCounpon = counponLists.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  console.log(counponLists);
  return (
    <div className="col-span-3 bg-util rounded-lg p-4 space-y-5">
      <h2 className="text-center bg-primary text-util py-2.5 rounded-[5px] font-medium">
        Sự kiện
      </h2>
      <form
        action=""
        className="space-y-4"
        onSubmit={handleSubmit(onSubmitEvent)}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name-event" value="Tên sự kiện" />
          </div>
          <input
            type="text"
            placeholder="Tên sự kiện"
            id="name-event"
            {...register("name", {
              required: "Tên là bắt buộc !",
              minLength:{
                value:8,
                message:"Tối thiếu 8 kí tự !"
              },
              maxLength:{
                value:225,
                message:"Tối đa 225 kí tự !"
              }
            })}
            className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
          />
          <span className="text-primary block text-sm mt-2">
            {errors.name?.message}
          </span>
        </div>
        <div className="mt-3 space-y-2">
          <div className="block">
            <Label htmlFor="select-vouchers" value="Chọn voucher" />
          </div>
          <Select
            mode="multiple"
            allowClear
            {...register("coupons", {
              required: "Vui lòng chọn voucher !",
            })}
            onClick={handleGetListVoucherEvent}
            onChange={(e) => setValue("coupons", e)}
            showSearch
            value={watch("coupons")}
            style={{ width: "100%", height: "35px" }}
            placeholder="Chọn các voucher"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={optionCounpon}
          />
          <span className="text-primary text-sm block">
            {errors.coupons?.message}
          </span>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="start-event" value="Ngày bắt đầu" />
          </div>
          <input
            type="date"
            placeholder="Ngày bắt đầu"
            id="name-event"
            {...register("start_date",{
              required:"Vui lòng chọn ngày bắt đầu !"
            })}
            className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
          />
          <span className="text-primary text-sm block">
            {errors.start_date?.message}
          </span>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="end-event" value="Ngày kết thúc" />
          </div>
          <input
            type="date"
            placeholder="Ngày kết thúc"
            {...register("end_date",{
              required:"Vui lòng chọn ngày kết thúc !"
            })}
            id="end-event"
            className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
          />
          <span className="text-primary text-sm block">
            {errors.end_date?.message}
          </span>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="desc-event" value="Mô tả sự kiện" />
          </div>
          <textarea
            placeholder="Mô tả sự kiện"
            id="desc-event"
            {...register("description")}
            className="block focus:!border-primary/50 text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
          ></textarea>
        </div>
        <div className="flex gap-3 items-center">
          <div className="block">
            <Label htmlFor="is_active-event" value="Trạng thái" />
          </div>
          <div>
            <ToggleSwitch
              sizing={"sm"}
              id="is_active-event"
              checked={watch("is_active")}
              {...register("is_active")}
              onChange={(e) => {
                setValue("is_active", e);
              }}
            />
          </div>
        </div>
        <ButtonSubmit content="Thêm sự kiện" />
      </form>
    </div>
  );
};

export default EventAddOrUpdateForm;
