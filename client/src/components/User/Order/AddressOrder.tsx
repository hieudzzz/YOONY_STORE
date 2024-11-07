import axios from "axios";
import { Label } from "flowbite-react";
import { Select } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

interface IAddress {
  id?: number;
  name: string;
  typeText: string;
}

interface FormData {
  fullName: string;
  phone: string;
  provinceId: number | null;
  districtId: number | null;
  wardId: null;
  address: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  provinceId?: string;
  districtId?: string;
  wardId?: string;
  address?: string;
}

const STORAGE_KEY = "addressOrderFormData";

const AddressOrder = forwardRef((props, ref) => {
  const [provinces, setProvinces] = useState<IAddress[]>([]);
  const [districts, setDistricts] = useState<IAddress[]>([]);
  const [wards, setWards] = useState<IAddress[]>([]);
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData
      ? JSON.parse(savedData)
      : {
          fullName: "",
          phone: "",
          provinceId: null,
          districtId: null,
          wardId: null,
          address: "",
        };
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useImperativeHandle(ref, () => ({
    validate: () => {
      const newErrors: FormErrors = {};
      Object.keys(formData).forEach((key) => {
        const error = validateField(key, formData[key as keyof FormData]);
        if (error) {
          newErrors[key as keyof FormErrors] = error;
        }
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
  }));

  useEffect(() => {
    fetchProvinces();
    if (formData.provinceId) getDistricts(formData.provinceId);
    if (formData.districtId) getWards(formData.districtId);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const fetchProvinces = async () => {
    try {
      const {
        data: { data: response },
      } = await axios.get(
        `${import.meta.env.VITE_API_ADRRESS}/provinces?page=0&size=63`,
        {
          timeout:3000
        }
      );
      setProvinces(response);
    } catch (error) {
      console.error("Error fetching provinces:", error);
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
        {
          timeout:3000
        }
      );
      setDistricts(response);
    } catch (error) {
      console.error("Error fetching districts:", error);
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
        {
          timeout:3000
        }
      );
      setWards(response);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const validateField = (
    name: string,
    value: string | number | null
  ): string | undefined => {
    switch (name) {
      case "fullName":
        return value && (value as string).length >= 2
          ? undefined
          : "Họ và tên phải có ít nhất 8 ký tự";
      case "phone":
        return value && /^[0-9]{10}$/.test(value as string)
          ? undefined
          : "Số điện thoại phải có 10 chữ số";
      case "provinceId":
        return value ? undefined : "Vui lòng chọn Tỉnh/Thành phố";
      case "districtId":
        return value ? undefined : "Vui lòng chọn Quận/Huyện";
      case "wardId":
        return value ? undefined : "Vui lòng chọn Phường/Xã";
      case "address":
        return value && (value as string).length >= 10
          ? undefined
          : "Địa chỉ phải có ít nhất 10 ký tự";
      default:
        return undefined;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  const handleProvinceChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      provinceId: value,
      districtId: null,
      wardId: null,
    }));
    setErrors((prev) => ({
      ...prev,
      provinceId: validateField("provinceId", value),
      districtId: undefined,
      wardId: undefined,
    }));
    getDistricts(value);
    setWards([]);
  };

  const handleDistrictChange = (value: number) => {
    setFormData((prev) => ({ ...prev, districtId: value, wardId: null }));
    setErrors((prev) => ({
      ...prev,
      districtId: validateField("districtId", value),
      wardId: undefined,
    }));
    getWards(value);
  };

  const handleWardChange = (value: number) => {
    setFormData((prev) => ({ ...prev, wardId: value }));
    setErrors((prev) => ({ ...prev, wardId: validateField("wardId", value) }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Xử lý gửi form ở đây
      console.log("Form is valid. Submitting...", formData);
    } else {
      console.log("Form has errors. Please correct them.");
    }
  };

  const optionsProvince = provinces.map((province) => ({
    value: province.id,
    label: province.name,
  }));
  const optionsDistricts = districts.map((district) => ({
    value: district.id,
    label: district.name,
  }));
  const optionsWards = wards.map((ward) => ({
    value: ward.id,
    label: ward.name,
  }));

  return (
    <div className="space-y-5">
      <h3 className="font-medium">Địa chỉ nhận hàng</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="fullName" value="Họ và tên" />
            </div>
            <input
              type="text"
              placeholder="Họ và tên"
              id="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none ${
                errors.fullName ? "border-primary/75" : ""
              }`}
            />
            {errors.fullName && (
              <p className="text-primary text-sm mt-1">{errors.fullName}</p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="phone" value="Số điện thoại" />
            </div>
            <input
              type="tel"
              placeholder="Số điện thoại"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none ${
                errors.phone ? "border-primary/75" : ""
              }`}
            />
            {errors.phone && (
              <p className="text-primary text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name-province" value="Tỉnh thành" />
            </div>
            <Select
              value={formData.provinceId}
              onChange={handleProvinceChange}
              showSearch
              style={{ width: "100%", height: 35 }}
              placeholder="Chọn tỉnh thành"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={optionsProvince}
              className={errors.provinceId ? "border-primary/75" : ""}
            />
            {errors.provinceId && (
              <p className="text-primary text-sm mt-1">{errors.provinceId}</p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name-districts" value="Quận/huyện" />
            </div>
            <Select
              value={formData.districtId}
              onChange={handleDistrictChange}
              showSearch
              style={{ width: "100%", height: 35 }}
              placeholder="Chọn Quận/huyện"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={optionsDistricts}
              className={errors.districtId ? "border-primary/75" : ""}
            />
            {errors.districtId && (
              <p className="text-primary text-sm mt-1">{errors.districtId}</p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name-wards" value="Phường/xã" />
            </div>
            <Select
              value={formData.wardId}
              onChange={handleWardChange}
              showSearch
              style={{ width: "100%", height: 35 }}
              placeholder="Chọn Phường/xã"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={optionsWards}
              className={errors.wardId ? "border-primary/75" : ""}
            />
            {errors.wardId && (
              <p className="text-primary text-sm mt-1">{errors.wardId}</p>
            )}
          </div>
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="address" value="Địa chỉ chi tiết" />
          </div>
          <input
            type="text"
            placeholder="Địa chỉ chi tiết"
            id="address"
            value={formData.address}
            onChange={handleInputChange}
            className={`block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none ${
              errors.address ? "border-primary/75" : ""
            }`}
          />
          {errors.address && (
            <p className="text-primary text-sm mt-1">{errors.address}</p>
          )}
        </div>
      </form>
    </div>
  );
});

export default AddressOrder;
