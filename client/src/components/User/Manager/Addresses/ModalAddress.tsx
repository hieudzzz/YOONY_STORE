import { ConfigProvider, message, Modal, Select } from "antd";
import { Label } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { AddressContext } from "../../../../contexts/AddressContext";
import { useForm } from "react-hook-form";
import { IAddress } from "../../../../interfaces/IAddress";
import axios from "axios";
import instance from "../../../../instance/instance";

type Props = {
  isModalOpen: boolean;
  handleCancel: () => void;
  setIsModalOpen: (isModalOpen: boolean) => void;
  idAddress: number;
  addOrUpdate: string;
  setAddOrUpdate: (addOrUpdate: string) => void;
};

interface IAddressApi {
  id?: number;
  name: string;
  typeText: string;
}

const ModalAddress = ({
  isModalOpen,
  setIsModalOpen,
  idAddress,
  addOrUpdate,
  handleCancel,
  setAddOrUpdate,
}: Props) => {
  const { dispatch } = useContext(AddressContext);
  const [provinces, setProvinces] = useState<IAddressApi[]>([]);
  const [districts, setDistricts] = useState<IAddressApi[]>([]);
  const [wards, setWards] = useState<IAddressApi[]>([]);
  const [user, setUser] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState<IAddressApi | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<IAddressApi | null>(
    null
  );
  const [selectedWard, setSelectedWard] = useState<IAddressApi | null>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<IAddress>();

  const getDetailAddress = async () => {
    try {
      const response = await instance.get(`get-address/${idAddress}`);
      const addressData = response.data.data[0];
      
      const provinces = await fetchProvinces();
      
      const selectedProvince = provinces.find(p => p.name === addressData.province);
      if (selectedProvince) {
        setSelectedProvince(selectedProvince);
        
        const districts = await getDistricts(selectedProvince.id!);
        const selectedDistrict = districts.find(d => d.name === addressData.district);
        if (selectedDistrict) {
          setSelectedDistrict(selectedDistrict);
          
          const wards = await getWards(selectedDistrict.id!);
          const selectedWard = Array(wards).find(w => w?.name === addressData.ward);
          if (selectedWard) {
            setSelectedWard(selectedWard);
          }
        }
      }

      reset(addressData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfor");
    if (storedUser) setUser(JSON.parse(storedUser));
    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem("userInfor");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);


  const handleOk = async (dataForm: IAddress) => {
    try {
      switch (addOrUpdate) {
        case "ADD":
          {
            const {
              data: { data: response },
            } = await instance.post("add-address", dataForm);
            if (response) {
              dispatch({
                type: "ADD",
                payload: response,
              });
              message.success("Thêm địa chỉ thành công !");
              reset();
              setIsModalOpen(false);
              if (!user?.address_id) {
              const userData = JSON.parse(localStorage.getItem("userInfor")!);
              userData.address_id = response?.id;
              localStorage.setItem("userInfor", JSON.stringify(userData));
              }
            }
          }
          break;
        case "UPDATE":
          {
            const {
              data: { data: response },
            } = await instance.put(`edit-address/${idAddress}`, dataForm);
            if (response) {
              dispatch({
                type: "UPDATE",
                payload: response,
              });
              message.success("Sửa địa chỉ thành công !");
              reset();
              setIsModalOpen(false);
            }
          }
          break;
        default:
          break;
      }
    } catch (error) {
      message.error(error?.response.data.error);
    }
  };

  const fetchProvinces = async () => {
    try {
      const {
        data: { data: response },
      } = await axios.get(
        `${import.meta.env.VITE_API_ADRRESS}/provinces?page=0&size=63`,
      );
      setProvinces(response);
      return response;
    } catch (error) {
      console.error("Error fetching provinces:", error);
      return [];
    }
  };

  const getDistricts = async (idProvince: number) => {
    try {
      const {
        data: { data: response },
      } = await axios.get(
        `${
          import.meta.env.VITE_API_ADRRESS
        }/districts/${idProvince}?page=0&size=100`,
      );
      setDistricts(response);
      return response;
    } catch (error) {
      console.error("Error fetching districts:", error);
      return [];
    }
  };

  const getWards = async (idDistrict: number) => {
    try {
      const {
        data: { data: response },
      } = await axios.get(
        `${
          import.meta.env.VITE_API_ADRRESS
        }/wards/${idDistrict}?page=0&size=100`,
      );
      setWards(response);
      return response;
    } catch (error) {
      console.error("Error fetching wards:", error);
      return [];
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchProvinces();
    }
  }, [isModalOpen]);

  const handleProvinceChange = (value: string, option: any) => {
    const province = provinces.find((p) => p.name === value);
    if (province) {
      setSelectedProvince(province);
      setValue("province", value);
      getDistricts(province.id!);
      setValue("district", "");
      setValue("ward", "");
      setDistricts([]);
      setWards([]);
    }
  };

  const handleDistrictChange = async (value: string, option: any) => {
    const district = districts.find((d) => d.name === value);
    if (district) {
      setSelectedDistrict(district);
      setValue("district", value);
      setSelectedWard(null);
      setValue("ward", "");
      await getWards(district?.id)
    }
  };

  const handleWardChange = (value: string, option: any) => {
    const ward = wards.find((w) => w.name === value);
    if (ward) {
      setSelectedWard(ward);
      setValue("ward", value);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      if (addOrUpdate === "UPDATE") {
        getDetailAddress();
      } else {
        fetchProvinces();
      }
    }
    if (isModalOpen === false) {
      setAddOrUpdate("ADD");
      reset({
        fullname: "",
        phone: "",
        address: "",
      });
      setSelectedProvince(null);
      setSelectedDistrict(null);
      setSelectedWard(null);
      setProvinces([]);
      setDistricts([]);
      setWards([]);
    }
  }, [isModalOpen, addOrUpdate]);

  return (
    <div>
      <Modal
        title={`${addOrUpdate === "ADD" ? "Địa chỉ mới" : "Sửa địa chỉ"}`}
        open={isModalOpen}
        onCancel={handleCancel}
        width={650}
        okText="Hoàn thành"
        cancelText="Trở lại"
        onOk={handleSubmit(handleOk)}
      >
        <form className="my-5 border-t border-[#f1f1f1] py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" value="Họ và tên" />
              <input
                type="text"
                placeholder="Họ và tên"
                id="fullName"
                {...register("fullname", {
                  required: "Bắt buộc !",
                  minLength: {
                    value: 8,
                    message: "Tối thiếu 8 kí tự",
                  },
                })}
                className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
              />
              <span className="text-xs text-primary block">
                {errors.fullname?.message}
              </span>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" value="Số điện thoại" />
              <input
                type="tel"
                placeholder="Số điện thoại"
                id="phone"
                {...register("phone", {
                  required: "Bắt buộc !",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Số điện thoại không đúng định dạng !",
                  },
                })}
                className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
              />
              <span className="text-xs text-primary block">
                {errors.phone?.message}
              </span>
            </div>
          </div>

          <ConfigProvider
            theme={{
              components: {
                Select: {
                  hoverBorderColor: "#ff990080",
                  activeBorderColor: "#ff990080",
                  activeOutlineColor: "#fff",
                },
              },
            }}
          >
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name-province" value="Tỉnh thành" />
                <Select
                  {...register("province", {
                    required: "Bắt buộc !",
                  })}
                  onChange={handleProvinceChange}
                  value={watch("province")}
                  showSearch
                  style={{ width: "100%", height: 35 }}
                  placeholder="Chọn tỉnh thành"
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={provinces.map((province) => ({
                    value: province.name,
                    label: province.name,
                  }))}
                />
                <span className="text-xs text-primary block">
                  {errors.province?.message}
                </span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name-districts" value="Quận/huyện" />
                <Select
                  {...register("district",{
                    required: "Bắt buộc !",
                  })}
                  onChange={handleDistrictChange}
                  value={watch("district")}
                  showSearch
                  style={{ width: "100%", height: 35 }}
                  placeholder="Chọn Quận/huyện"
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={districts.map((district) => ({
                    value: district.name,
                    label: district.name,
                  }))}
                />
                <span className="text-xs text-primary block">
                  {errors.district?.message}
                </span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name-wards" value="Phường/xã" />
                <Select
                  {...register("ward",{
                    required: "Bắt buộc !",
                  })}
                  onChange={handleWardChange}
                  value={watch("ward")}
                  showSearch
                  style={{ width: "100%", height: 35 }}
                  placeholder="Chọn Phường/xã"
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={wards.map((ward) => ({
                    value: ward.name,
                    label: ward.name,
                  }))}
                />
                 <span className="text-xs text-primary block">
                  {errors.ward?.message}
                </span>
              </div>
            </div>
          </ConfigProvider>
          <div className="space-y-1.5">
            <Label htmlFor="addressDetail" value="Địa chỉ cụ thể" />
            <textarea
              {...register("address",{
                required:"Bắt buộc !",
                minLength:{
                    value:10,
                    message:"Tối thiếu 10 kí tự"
                },
                maxLength:{
                    value:225,
                    message:"Tối đa 225 kí tự"
                }
              })}
              placeholder="Địa chỉ cụ thể"
              className="w-full border border-[#f1f1f1] rounded-md placeholder:text-secondary/40 placeholder:text-sm focus:!border-primary/50"
            />
             <span className="text-xs text-primary block">
                  {errors.address?.message}
                </span>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ModalAddress;
