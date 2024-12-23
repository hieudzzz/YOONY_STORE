import { Label } from "flowbite-react";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";
import { useForm } from "react-hook-form";
import { ISupplier } from "../../../interfaces/ISupplier";
import instance from "../../../instance/instance";
import { useCallback, useContext, useEffect, useState } from "react";
import { SupplierContext } from "../../../contexts/SupplierContext";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
const AddOrUpdateSupplier = () => {
  const { suppliers, dispatch } = useContext(SupplierContext);
  const [searchParams] = useSearchParams();
  const [currentId, setCurrentId] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ISupplier>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  const fetchSupplierData = useCallback(
    async (id: string) => {
      try {
        const response = await instance.get(`supplier/${id}`);
        const supplierData = response.data.data;

        if (!supplierData) {
          toast.error("Nhà cung cấp không tồn tại");
          setCurrentId(null);
          return;
        }

        Object.keys(supplierData).forEach((key) => {
          if (["name", "phone", "email", "address"].includes(key)) {
            setValue(key as keyof ISupplier, supplierData[key] || "");
          }
        });
      } catch (error) {
        console.error("Fetch Supplier Error:", error);
        toast.error("Không thể tải thông tin nhà cung cấp");
        reset();
        setCurrentId(null);
      }
    },
    [setValue, reset]
  );

  useEffect(() => {
    const id = searchParams.get("id");

    if (id !== currentId) {
      setCurrentId(id);

      if (id) {
        fetchSupplierData(id);
      }
    }
  }, [searchParams, fetchSupplierData, currentId !== undefined]);
;

  const onSubmit = async (dataForm: ISupplier) => {
    try {
      if (currentId) {
        const response = await instance.put(
          `update-supplier/${currentId}`,
          dataForm
        );

        dispatch({
          type: "UPDATE",
          payload: response.data.data,
        });
        reset();
        toast.success("Cập nhật nhà cung cấp thành công");
        navigate('/admin/products/suppliers?page=1')
        setCurrentId(null);
      } else {
        const response = await instance.post("store-supplier", dataForm);

        dispatch({
          type: "ADD",
          payload: response.data.data,
        });

        toast.success("Thêm nhà cung cấp thành công");
        navigate('/admin/products/suppliers?page=1')
      }
      reset();
      setCurrentId(null);
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
  return (
    <div className="col-span-3 bg-util rounded-md min-h-screen p-5 space-y-5">
      <h2 className="font-medium text-util py-2 bg-primary text-center rounded-sm">
        {currentId ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp"}
      </h2>
      <form action="" className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <div className="block">
            <Label htmlFor="name-Supplier" value="Tên nhà cung cấp" />
          </div>
          <input
            type="text"
            placeholder="Tên nhà cung cấp"
            id="name-Supplier"
            {...register("name", {
              required: "Tên là bắt buộc",
              minLength: {
                value: 6,
                message: "Tên tối thiểu 6 kí tự",
              },
            })}
            className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
          />
          <span className="text-primary block text-sm">
            {errors.name?.message}
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="block">
            <Label htmlFor="phone-supplier" value="Số điện thoại" />
          </div>
          <input
            type="tel"
            placeholder="Số điện thoại"
            id="phone-supplier"
            {...register("phone", {
              required: "Bắt buộc !",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Số điện thoại không đúng định dạng !",
              },
            })}
            className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
          />
          <span className="text-primary block text-sm">
            {errors.phone?.message}
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="block">
            <Label htmlFor="email-supplier" value="Email" />
          </div>
          <input
            type="tel"
            placeholder="Email"
            id="email-supplier"
            {...register("email", {
              required: "Email là bắt buộc",
              pattern: {
                value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
                message: "Email sai định dạng !",
              },
            })}
            className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
          />
          <span className="text-primary block text-sm">
            {errors.email?.message}
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="block">
            <Label htmlFor="address-supplier" value="Địa chỉ" />
          </div>
          <textarea
            placeholder="Địa chỉ"
            id="address-supplier"
            {...register("address", {
              required: "Địa chỉ là bắt buộc",
              minLength: {
                value: 10,
                message: "Địa chỉ tối thiểu 10 kí tự",
              },
              maxLength: {
                value: 255,
                message: "Tên tối đa 255 kí tự",
              },
            })}
            rows={3}
            className="block focus:!border-primary/50 text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
          ></textarea>
          <span className="text-primary block text-sm">
            {errors.address?.message}
          </span>
        </div>
        <ButtonSubmit content={currentId ? "Cập nhật" : "Thêm mới"} />
      </form>
    </div>
  );
};

export default AddOrUpdateSupplier;
