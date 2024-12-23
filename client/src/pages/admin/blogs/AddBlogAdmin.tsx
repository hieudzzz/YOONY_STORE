import JoditEditor from "jodit-react";
import { useContext, useMemo, useRef, useState } from "react";
import LoadingOverlay from "react-loading-overlay-ts";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";
import { useForm } from "react-hook-form";
import { IBlog } from "../../../interfaces/IBlogs";
import { ConfigProvider, Switch } from "antd";
import { Label } from "flowbite-react";
import instance from "../../../instance/instance";
import axios from "axios";
import slugify from "react-slugify";
import { BlogContext } from "../../../contexts/BlogsContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
type Prop={
  setSteps:(steps:string)=>void
}
const AddBlogAdmin = ({setSteps}:Prop) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IBlog>({
    defaultValues: {
      is_active: true,
    },
  });
  const [content, setContent] = useState<string>("");
  const editorRef = useRef(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const { dispatch } = useContext(BlogContext);

  const handleUploadImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_PRESET_KEY_CLOADINARY
      );
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUD_NAME_CLOADINARY
        }/image/upload`,
        formData
      );
      return data.secure_url;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  const onSubmit = async (dataForm: IBlog) => {
    try {
      setIsLoading(true);
      window.scrollTo({
        top:0,
        behavior:'smooth'
      })
      let thumbnailUrl = "";
      if (thumbnail) {
        thumbnailUrl = await handleUploadImage(thumbnail);
      }

      const { title, is_active } = dataForm;
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const images = doc.querySelectorAll("img");

      const uploadImagesBlog = Array.from(images).map(async (img) => {
        const src = img.src;
        const response = await fetch(src);
        const fileBlob = await response.blob();
        const formData = new FormData();
        formData.append("file", fileBlob);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_PRESET_KEY_CLOADINARY
        );
        const responseImageCloud = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME_CLOADINARY
          }/image/upload`,
          formData
        );
        return { originalSrc: src, newSrc: responseImageCloud.data.secure_url };
      });

      const dataImagesCloud = await Promise.all(uploadImagesBlog);
      let contentNew = content;
      dataImagesCloud.forEach((img) => {
        contentNew = contentNew.replace(img.originalSrc, img.newSrc);
      });

      const { data:{data:response} } = await instance.post("blogs", {
        thumbnail: thumbnailUrl,
        content: contentNew,
        slug: slugify(watch("title")),
        title,
        is_active,
      });
      if (response) {
        setIsLoading(false);
        dispatch({
          type: "ADD",
          payload: response,
        });
        toast.success('Thêm bài viết thành công')
        setSteps('1')
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Viết bài ...",
      uploader: {
        insertImageAsBase64URI: true,
      },
      height: 500,
    }),
    []
  );
  return (
    <div>
      <LoadingOverlay
        active={isLoading}
        spinner
        text="Đang thêm bài viết ..."
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
          action=""
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 max-w-4xl"
        >
          <div className="space-y-2">
            <div className="mb-2 block">
              <Label htmlFor="title" value="Tiêu đề bài viết" />
            </div>
            <input
              type="text"
              placeholder="Nhập tiêu đề"
              id="title"
              {...register("title", {
                required: "Tiêu đề không được để trống !",
              })}
              className="block focus:!border-primary/50 h-[40px] font-medium text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
            />
            <span className="text-primary block text-sm">
              {errors.title?.message}
            </span>
          </div>
          <div className="space-y-2">
            <div className="mb-2 block">
              <Label htmlFor="title" value="Thumbnail" />
            </div>
            <div className="border group border-primary border-dashed overflow-hidden max-w-[250px] rounded-md hover:cursor-pointer relative">
              <input
                type="file"
                id="thumbnail"
                {...register("thumbnail")}
                onChange={(e) => {
                  if (e.target.files) {
                    setThumbnail(e.target.files[0]);
                  }
                }}
                className="py-10 px-2 hover:cursor-pointer opacity-0 z-[999] relative gruop"
              />
              {thumbnail && (
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-35 z-40 transition-opacity duration-300 text-primary flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-6"
                    color={"currentColor"}
                    fill={"none"}
                  >
                    <path
                      d="M14.0737 3.88545C14.8189 3.07808 15.1915 2.6744 15.5874 2.43893C16.5427 1.87076 17.7191 1.85309 18.6904 2.39232C19.0929 2.6158 19.4769 3.00812 20.245 3.79276C21.0131 4.5774 21.3972 4.96972 21.6159 5.38093C22.1438 6.37312 22.1265 7.57479 21.5703 8.5507C21.3398 8.95516 20.9446 9.33578 20.1543 10.097L10.7506 19.1543C9.25288 20.5969 8.504 21.3182 7.56806 21.6837C6.63212 22.0493 5.6032 22.0224 3.54536 21.9686L3.26538 21.9613C2.63891 21.9449 2.32567 21.9367 2.14359 21.73C1.9615 21.5234 1.98636 21.2043 2.03608 20.5662L2.06308 20.2197C2.20301 18.4235 2.27297 17.5255 2.62371 16.7182C2.97444 15.9109 3.57944 15.2555 4.78943 13.9445L14.0737 3.88545Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13 4L20 11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 22L22 22"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
              <span className="text-primary absolute top-[50%] z-30 left-[50%] -translate-x-[50%] -translate-y-[50%]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-8"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M13 3.00231C12.5299 3 12.0307 3 11.5 3C7.02166 3 4.78249 3 3.39124 4.39124C2 5.78249 2 8.02166 2 12.5C2 16.9783 2 19.2175 3.39124 20.6088C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.6088C20.9472 19.2703 20.998 17.147 20.9999 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2 14.1354C2.61902 14.0455 3.24484 14.0011 3.87171 14.0027C6.52365 13.9466 9.11064 14.7729 11.1711 16.3342C13.082 17.7821 14.4247 19.7749 15 22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 16.8962C19.8246 16.3009 18.6088 15.9988 17.3862 16.0001C15.5345 15.9928 13.7015 16.6733 12 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 4.5C17.4915 3.9943 18.7998 2 19.5 2M22 4.5C21.5085 3.9943 20.2002 2 19.5 2M19.5 2V10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {thumbnail && (
                <img
                  src={URL.createObjectURL(thumbnail)}
                  className="object-cover object-center absolute top-0 z-30 block w-full h-full"
                  alt="Thumbnail preview"
                />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="mb-2 block">
              <Label htmlFor="title" value="Nội dung" />
            </div>
            <JoditEditor
              ref={editorRef}
              value={content}
              onChange={(newContent: any) => {
                setContent(newContent);
              }}
              config={config}
            />
            <span className="text-primary block text-sm">
              {!content && "Nội dung bài viết không được trống"}
            </span>
          </div>
          <div className="flex gap-2">
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#ff9900",
                  colorInfoHover: "#fff5e5",
                  controlItemBgActiveHover: "#fff5e5",
                },
              }}
            >
              <Switch
                checked={watch("is_active")}
                onChange={(e) => {
                  setValue("is_active", e);
                }}
              />
            </ConfigProvider>
            Trạng thái
          </div>
          <ButtonSubmit content="Thêm bài viết" />
        </form>
      </LoadingOverlay>
    </div>
  );
};

export default AddBlogAdmin;
