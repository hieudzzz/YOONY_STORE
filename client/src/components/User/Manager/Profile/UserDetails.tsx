import { useState } from "react";
import { Upload, message } from "antd";
import instance from "../../../../instance/instance";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { useForm } from "react-hook-form";
import { IUser } from "../../../../interfaces/IUser";
import axios from "axios";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
import ChangePasswordUser from "./ChangePasswordUser";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const UserDetails = () => {
  const [isLoading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("userInfor")!);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<IUser>();

  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: user?.avatar,
    },
  ]);

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const image_type = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  const preset_key = import.meta.env.VITE_PRESET_KEY_CLOADINARY;
  const cloud_name = import.meta.env.VITE_CLOUD_NAME_CLOADINARY;

  const updateProfileHandler = async () => {
    try {
      if (fileList[0].url) {
        const { data } = await instance.put("user/update", {
          name: watch("name"),
          avatar: fileList[0].url,
          tel: watch("tel"),
        });
        if (data) {
          message.success("Cập nhật thông tin thành công !");
          localStorage.setItem("userInfor", JSON.stringify(data?.user));
          window.dispatchEvent(new Event("auth-change"));
        }
      }

      if (fileList[0].originFileObj as Blob) {
        const check_type_image = image_type.some(
          (item) => fileList[0].type === item
        );
        if (!check_type_image) {
          message.error("Chỉ hỗ trợ định dạng .jpg, .jpeg, .png và .webp");
          setLoading(false);
          return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (fileList[0].size! > maxSize) {
          message.error(
            "Kích thước ảnh quá lớn. Vui lòng chọn file nhỏ hơn 5MB"
          );
          setLoading(false);
          return;
        }
        const imageupload = new FormData();
        imageupload.append("file", fileList[0].originFileObj as Blob);
        imageupload.append("upload_preset", preset_key);
        try {
          setLoading(true);
          const uploadResponse = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            imageupload
          );
          const { data } = await instance.put("user/update", {
            name: watch("name"),
            avatar: uploadResponse.data.secure_url,
            tel: watch("tel"),
          });
          if (data) {
            setLoading(false);
            message.success("Cập nhật thông tin thành công !");
            localStorage.setItem("userInfor", JSON.stringify(data?.user));
            window.dispatchEvent(new Event("auth-change"));
            setFileList([
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: data?.user?.avatar,
              },
            ]);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col lg:flex-row lg:justify-start border border-[#f1f1f1] rounded-md bg-white h-[fit-content] w-full">
      <LoadingOverlay
        active={isLoading}
        spinner
        styles={{
          overlay: (base) => ({
            ...base,
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(4px)",
          }),
          spinner: (base) => ({
            ...base,
            width: "40px",
            "& svg circle": {
              stroke: "rgba(255, 153, 0,5)",
              strokeWidth: "3px",
            },
          }),
        }}
      >
        <form
          className="flex-1 max-w-lg p-6 rounded-sm space-y-5"
          onSubmit={handleSubmit(updateProfileHandler)}
        >
          <ImgCrop rotationSlider>
            <Upload
              beforeUpload={() => {
                return false;
              }}
              listType="picture-circle"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
            >
              {fileList.length < 1 && "+ Tải lên"}
            </Upload>
          </ImgCrop>
          <div className="flex items-start">
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="username"
                    className="block text-gray-700 text-sm font-bold"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    defaultValue={user?.name}
                    {...register("name", {
                      required: "Tên không được để trống !",
                    })}
                    onChange={(e) => setValue("name", e.target.value)}
                    className="appearance-none border border-gray-300 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập username"
                  />
                  <span className="text-xs text-primary block">
                    {errors.name?.message}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 text-sm font-bold"
                  >
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    defaultValue={user?.tel}
                    {...register("tel", {
                      required: "Số điện thoại không được rỗng !",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Số điện thoại không đúng định dạng !",
                      },
                    })}
                    className="appearance-none border border-gray-300 rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập số điện thoại"
                  />
                  <span className="text-xs text-primary block">
                    {errors.tel?.message}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="address"
                  className="block text-gray-700 text-sm font-bold"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  disabled
                  defaultValue={user?.email}
                  className="appearance-none border border-gray-300 rounded-sm w-full bg-secondary/5 py-2 px-3 text-secondary/50 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-start">
            <button className="bg-primary hover:bg-primary text-white text-sm py-2 px-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                color={"currentColor"}
                fill={"none"}
                className="text-white size-5"
              >
                <path
                  d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sửa Profile
            </button>
          </div>
        </form>
      </LoadingOverlay>
      <div className="border-r border-[#f1f1f1]"></div>
      <ChangePasswordUser />
    </div>
  );
};

export default UserDetails;
