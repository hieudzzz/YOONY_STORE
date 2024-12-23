import { Modal, Select, ToggleSwitch } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";
import { useForm } from "react-hook-form";
import { IVoucher } from "../../../interfaces/IVouchers";
import { VoucherContext } from "../../../contexts/VouchersContext";
import { zodResolver } from "@hookform/resolvers/zod";
import VoucherSchemaValid from "../../../validations/voucherValidSchema";
import instance from "../../../instance/instance";
import { toast } from "react-toastify";
import ListVouchersAdmin from "./ListVouchersAdmin";
import ramdom from "random-string-generator";
import axios from "axios";
import { Input, Pagination } from "antd";
const VouchersAdmin = () => {
  const [openModal, setOpenModal] = useState(false);
  const [status, setStatus] = useState(false);
  const [vouchers, setVoucher] = useState<IVoucher[]>([]);
  const [codeVoucher, setCodeVoucher] = useState("");
  const { dispatch, meta, page, setSearchParams } = useContext(VoucherContext);
  const [AddOrUpdate, setAddOrUpdate] = useState<string>("ADD");
  const [idVoucher, setIdVoucher] = useState<string>("");
  const [valueSearch, setValueSearch] = useState<string>("");
  const { Search } = Input;

  const handleRamdomVoucher = () => {
    const randomCode = ramdom("uppernumeric");
    setCodeVoucher(randomCode);
    setValue("code", randomCode);
  };
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm<IVoucher>({
    resolver: zodResolver(VoucherSchemaValid),
  });

  const onSubmit = async (dataForm: IVoucher) => {
    try {
      if (AddOrUpdate === "ADD") {
        const { data } = await instance.post("coupon", dataForm);
        dispatch({
          type: "ADD",
          payload: data.data,
        });
        toast.success("Thêm coupon thành công !");
      } else {
        const { data } = await instance.put(`coupon/${idVoucher}`, dataForm);
        dispatch({
          type: "UPDATE",
          payload: data.data,
        });
        toast.success("Sửa coupon thành công !");
      }
      setOpenModal(false);
      reset();
      setCodeVoucher("");
      setStatus(true);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.errors.code[0]);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Đã xảy ra lỗi không mong muốn");
      }
    }
  };

  useEffect(() => {
    reset({});
    setCodeVoucher("");
    setStatus(true);
    setAddOrUpdate("ADD");
  }, [openModal === false]);

  return (
    <div className="bg-util p-5 space-y-5 rounded-lg">
      <div className="space-y-4 md:flex justify-between md:space-y-0">
        <button
          onClick={() => {
            setOpenModal(true);
          }}
          className="flex items-center gap-1 text-white py-2 md:py-1.5 px-3.5 bg-primary hover:bg-transparent hover:outline-primary hover:outline-1 hover:outline hover:text-primary transition-all rounded-sm text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Thêm mã giảm giá
        </button>
        <div>
          <Search
            placeholder="Mã giảm giá"
            allowClear
            onChange={(e) => {
              setValueSearch(e.target.value);
            }}
            size="large"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <ListVouchersAdmin
          vouchers={vouchers || []}
          setOpenModal={setOpenModal}
          reset={reset}
          setStatus={setStatus}
          setCodeVoucher={setCodeVoucher}
          setIdVoucher={setIdVoucher}
          setAddOrUpdate={setAddOrUpdate}
          valueSearch={valueSearch}
        />
      </div>
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
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
        className="h-full"
        size={"md"}
      >
        <Modal.Header>
          {AddOrUpdate === "ADD" ? "Thêm" : "Sửa"} voucher
        </Modal.Header>
        <Modal.Body>
          <div className="flex justify-center px-3 pb-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3 w-full max-w-md"
            >
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label htmlFor="code" className="font-medium text-sm">
                      Mã giảm giá
                    </label>
                    <button
                      className="flex items-center text-sm gap-1 text-primary"
                      type="button"
                      onClick={handleRamdomVoucher}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                        />
                      </svg>
                      Random
                    </button>
                  </div>
                  <input
                    type="text"
                    className="block px-2 py-2 border border-[#d9d9d9] rounded-md w-full h-10 text-sm"
                    value={codeVoucher.toUpperCase()}
                    placeholder="Mã giảm giá: "
                    {...register("code", {
                      onChange(event) {
                        setCodeVoucher(event.target.value);
                      },
                    })}
                  />
                  <span className="text-sm text-red-400">
                    {errors.code?.message}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="name" className="font-medium text-sm">
                    Tên giảm giá
                  </label>
                  <input
                    type="text"
                    className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                    placeholder="Tên giảm giá"
                    {...register("name")}
                  />
                  <span className="text-sm text-red-400">
                    {errors.name?.message}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="discount_type"
                    className="font-medium text-sm"
                  >
                    Kiểu giảm giá
                  </label>
                  <Select {...register("discount_type")} id="discount_type">
                    <option value="fixed">Cố định</option>
                    <option value="percentage">Phần trăm</option>
                  </Select>
                  <span className="text-sm text-red-400">
                    {errors.discount_type?.message}
                  </span>
                </div>
                <div className="flex gap-2">
                  {watch("discount_type") === "fixed" ? (
                    <div className="space-y-1.5 w-full">
                      <label htmlFor="discount" className="font-medium text-sm">
                        Giảm giá (VND)
                      </label>
                      <input
                        type="number"
                        className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                        placeholder="Số tiền giảm"
                        {...register("discount", {
                          valueAsNumber: true,
                          validate: {
                            positive: (value) =>
                              value >= 0 || "Giảm giá phải là số dương",
                          },
                        })}
                        min={0}
                        style={{ pointerEvents: "auto" }}
                      />
                      <span className="text-sm text-red-400">
                        {errors.discount?.message}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 w-full">
                      <label htmlFor="discount" className="font-medium text-sm">
                        Giảm giá (%)
                      </label>
                      <input
                        type="number"
                        className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                        placeholder="Phần trăm giảm"
                        {...register("discount", {
                          valueAsNumber: true,
                          validate: {
                            range: (value) =>
                              (value >= 0 && value <= 100) ||
                              "Giảm giá phải từ 0-100%",
                          },
                        })}
                        min={0}
                        max={100}
                        style={{ pointerEvents: "auto" }}
                      />
                      <span className="text-sm text-red-400">
                        {errors.discount?.message}
                      </span>
                    </div>
                  )}
                  <div className="space-y-1.5 w-full">
                    <label
                      htmlFor="usage_limits"
                      className="font-medium text-sm"
                    >
                      Giới hạn sử dụng
                    </label>
                    <input
                      type="number"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder="Giới hạn sử dụng"
                      {...register("usage_limit", {
                        valueAsNumber: true,
                      })}
                      min={0}
                      style={{ pointerEvents: "auto" }}
                    />
                    <span className="text-sm text-red-400">
                      {errors.usage_limit?.message}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="min_order_value"
                      className="font-medium text-sm"
                    >
                      Giá trị đơn tối thiểu
                    </label>
                    <input
                      type="number"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder="Giá trị đơn tối thiểu"
                      {...register("min_order_value")}
                      min={0}
                      style={{ pointerEvents: "auto" }}
                    />
                    <span className="text-sm text-red-400">
                      {errors.min_order_value?.message}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="max_order_value"
                      className="font-medium text-sm"
                    >
                      Giá trị đơn tối đa
                    </label>
                    <input
                      type="number"
                      className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                      placeholder="Giá trị đơn tối đa"
                      {...register("max_order_value")}
                      min={0}
                      style={{ pointerEvents: "auto" }}
                    />
                    <span className="text-sm text-red-400">
                      {errors.max_order_value?.message}
                    </span>
                  </div>
                </div>
                {
                  watch('discount_type')==='percentage' && (
                    <div className="space-y-1.5">
                    <label htmlFor="max_discount" className="font-medium text-sm">
                      Giảm giá tối đa
                    </label>
                    <input
                        type="number"
                        className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                        placeholder="Giảm giá tối đa"
                        {...register("max_discount")}
                        min={0}
                        style={{ pointerEvents: "auto" }}
                      />
                    <span className="text-sm text-red-400">
                      {errors.max_discount?.message}
                    </span>
                  </div>
                  )
                }
                <div className="space-y-1.5">
                  <label htmlFor="start_date" className="font-medium text-sm">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                    {...register("start_date")}
                  />
                  <span className="text-sm text-red-400">
                    {errors.start_date?.message}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="end_date" className="font-medium text-sm">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full h-10 text-sm"
                    {...register("end_date")}
                  />
                  <span className="text-sm text-red-400">
                    {errors.end_date?.message}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="description" className="font-medium text-sm">
                    Mô tả giảm giá
                  </label>
                  <textarea
                    className="block border border-[#d9d9d9] px-2 py-2 rounded-md w-full text-sm"
                    id=""
                    rows={3}
                    placeholder="Mô tả giảm giá"
                    {...register("description")}
                  ></textarea>
                  <span className="text-sm text-red-400">
                    {errors.description?.message}
                  </span>
                </div>
                <div className="flex gap-5 place-items-center">
                  <div className="space-y-1.5">
                    <ToggleSwitch
                      label="Trạng thái"
                      {...register("status")}
                      checked={status}
                      onChange={() => {
                        setStatus(!status);
                        setValue("status", !status);
                      }}
                      sizing={"md"}
                      className="my-5"
                    />
                  </div>
                </div>
              </div>
              <ButtonSubmit
                content={`${AddOrUpdate === "ADD" ? "Thêm" : "Sửa"} voucher`}
              />
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VouchersAdmin;
