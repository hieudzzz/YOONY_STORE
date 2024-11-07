import { Select } from "antd";
import { Label, ToggleSwitch } from "flowbite-react";
import JoditEditor from "jodit-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";
import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { IProduct } from "../../../interfaces/IProduct";
import ButtonSubmit from "../../../components/Admin/ButtonSubmit";
import Attribute_Value_Variant from "./Attribute_Value_Variant";
import slugify from "react-slugify";
import instance from "../../../instance/instance";
import { ICategory } from "../../../interfaces/ICategory";
import { toast } from "react-toastify";
import _ from "lodash";
import axios from "axios";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import productValidSchema, {
  ProductFormData,
} from "../../../validations/productValidSchema";
import ProductContext from "../../../contexts/ProductContext";
import { DatePicker } from "antd";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

const FormAddOrUpdateProduct = () => {
  const editor = useRef(null);
  const [descProduct, setDescProduct] = useState("");
  const [categorys, setCategorys] = useState<ICategory[]>([]);
  const [isLoadingProduct, setLoadingProduct] = useState<boolean>(false);
  const [imagesProduct, setImagesProduct] = useState<string[]>([]);
  const [AddOrUpdate, setAddOrUpdate] = useState("ADD");
  const { id } = useParams();
  const configEditor = useMemo(
    () => ({
      readonly: false,
      placeholder: "",
      height: 200,
      width: "100%",
      enableDragAndDropFileToEditor: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "ul",
        "ol",
        "|",
        "align",
        "|",
        "link",
        "image",
        "|",
        "undo",
        "redo",
        "|",
        "eraser",
        "fullsize",
        "source",
      ],
      uploader: {
        insertImageAsBase64URI: false,
      },
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      toolbarAdaptive: true,
      toolbarSticky: true,
      allowResizeY: false,
      speechRecognize: false,
      spellcheck: true,
      editorCssClass: "product-description-editor",
      iframe: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_clear_html",
    }),
    []
  );
  const { dispatch } = useContext(ProductContext);
  const navigate = useNavigate();
  const method = useForm<IProduct>({
    defaultValues: {
      name: undefined,
      slug: undefined,
      images: [],
      description: undefined,
      category_id: undefined,
      is_active: true,
      is_featured: false,
      is_good_deal: false,
      variants: [
        {
          price: undefined,
          sale_price: undefined,
          end_sale: undefined,
          image: undefined,
          attribute_values: [{}],
        },
      ],
      is_variant: false,
    },
    // resolver: zodResolver(productValidSchema),
    mode: "onChange",
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
  } = method;

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const fetchData = useCallback(async () => {
    try {
      const {
        data: { data: response },
      } = await instance.get("category");
      setCategorys(response);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchProductData = useCallback(async () => {
    if (id) {
      try {
        const {
          data: { data: response },
        } = await instance.get(`products/${id}`);
        // console.log(response);
        reset({
          ...response,
          variants: response.variants.map((variant) => ({
            ...variant,
            end_sale: variant.end_sale ? variant.end_sale : null,
            attribute_values: variant.attribute_values.map((av) => ({
              attribute_id: av.attribute_id,
              attribute_value_id: av.pivot.attribute_value_id,
              type: av.attribute.type,
            })),
          })),
        });
        setImagesProduct(response.images);
        setDescProduct(response.description);
        setAddOrUpdate("UPDATE");
      } catch (error) {
        console.log(error);
      }
    }
  }, [id !== undefined]);

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const optionsCategory = useMemo(() => {
    return categorys.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  }, [categorys]);

  const slugValueCategory = useMemo(() => {
    setValue("slug", slugify(watch("name")));
  }, [watch("name")]);

  const handleUploadImageProduct = (e: any) => {
    const imgForms = e.target.files;
    if (AddOrUpdate === "ADD") {
      setImagesProduct(imgForms);
      if ([...imagesProduct].length > 0) {
        setImagesProduct(_.uniqBy([...imagesProduct, ...imgForms], "name"));
      }
    } else {
      setImagesProduct([...imagesProduct, ...imgForms]);
    }
  };

  const handleRemoveImagesProductBlob = (image_name: string) => {
    setImagesProduct(
      [...imagesProduct].filter((image) => {
        return image.name !== image_name;
      })
    );
  };
  const handleRemoveImagesProductUrl = (url: any) => {
    setImagesProduct(
      [...imagesProduct].filter((image) => {
        return image !== url;
      })
    );
  };

  const onSubmit = async (dataForm: IProduct) => {
    try {
      dataForm.variants.forEach((variant) => {
        const newAttributeValues: any = [];
        variant.attribute_values.forEach((attr) => {
          if (Array.isArray(attr.attribute_value_id)) {
            newAttributeValues.push(...attr.attribute_value_id);
          } else {
            newAttributeValues.push(attr.attribute_value_id);
          }
        });

        return (variant.attribute_values = newAttributeValues);
      });
      const uploadCloud = [...imagesProduct].map(async (file) => {
        setLoadingProduct(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_PRESET_KEY_CLOADINARY
        );
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME_CLOADINARY
          }/image/upload`,
          formData
        );
        return response.data.secure_url;
      });
      const urls = await Promise.all(uploadCloud);
      dataForm.images = urls;

      if (AddOrUpdate === "ADD") {
        const {
          data: { data: response },
        } = await instance.post("products", dataForm);
        if (response) {
          console.log(response);
          toast.success("Thêm sản phẩm thành công!");
          setLoadingProduct(false);
          reset();
          setImagesProduct([]);
          setDescProduct("");
          dispatch({
            type: "ADD",
            payload: response,
          });
          navigate("/admin/products");
        }
      }
      if (AddOrUpdate === "UPDATE") {
        const { data } = await instance.put(`products/${id}`, dataForm);
        if (data) {
          console.log(data);
          toast.success("Update sản phẩm thành công!");
          dispatch({
            type: "UPDATE",
            payload: data,
          });
          setAddOrUpdate("ADD");
          setLoadingProduct(false);
          navigate("/admin/products");
        }
      }
    } catch (error) {
      setLoadingProduct(false);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Đã xảy ra lỗi không mong muốn");
      }
    }
  };

  return (
    <FormProvider {...method}>
      <LoadingOverlay
        active={isLoadingProduct}
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
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-[15px]">
            <div className="space-y-2">
              <div className="mb-2 block">
                <Label htmlFor="value-product" value="Tên sản phẩm" />
              </div>
              <input
                type="text"
                placeholder="Tên sản phẩm"
                id="value-product"
                {...register("name")}
                className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
              />
              <span className="text-primary block text-sm">
                {errors.name?.message}
              </span>
            </div>
            <div className="space-y-2">
              <div className="mb-2 block">
                <Label htmlFor="slug-product" value="Slug" />
              </div>
              <input
                type="text"
                placeholder="Slug"
                id="slug-product"
                value={slugValueCategory!}
                {...register("slug")}
                disabled
                className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] text-[#00000040] bg-gray-100 border-input rounded-[5px] w-full focus:!shadow-none"
              />
              <span className="text-primary block text-sm">
                {errors.slug?.message}
              </span>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="categorys" value="Danh mục" />
              </div>
              <Select
                {...register("category_id")}
                onChange={(e) => setValue("category_id", e)}
                showSearch
                value={watch("category_id")}
                style={{ width: "100%", height: "35px" }}
                placeholder="Chọn danh mục"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={optionsCategory}
              />
              <span className="text-primary block text-sm mt-2">
                {errors.category_id?.message}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-[15px]">
            <div className="col-span-4">
              <div className=" mb-2 flex gap-3">
                <Label htmlFor="images-product" value="Album ảnh" />
                <span className="text-primary block text-sm">
                  {[...imagesProduct].length <= 0 && "Ảnh là bắt buộc !"}
                </span>
              </div>
              <div className="border overflow-hidden h-full max-h-[100px] rounded-[5px] flex relative mb-4">
                <input
                  type="file"
                  multiple
                  {...register("images", {
                    onChange(event) {
                      handleUploadImageProduct(event);
                    },
                  })}
                  accept="image/*"
                  id="images-product"
                  className="hover:cursor-pointer opacity-0 z-50"
                />
                <div className="absolute z-40 top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 6.75C22.4142 6.75 22.75 6.41421 22.75 6C22.75 5.58579 22.4142 5.25 22 5.25V6.75ZM14 5.25C13.5858 5.25 13.25 5.58579 13.25 6C13.25 6.41421 13.5858 6.75 14 6.75V5.25ZM18.75 2C18.75 1.58579 18.4142 1.25 18 1.25C17.5858 1.25 17.25 1.58579 17.25 2H18.75ZM17.25 10C17.25 10.4142 17.5858 10.75 18 10.75C18.4142 10.75 18.75 10.4142 18.75 10H17.25ZM22 5.25H18V6.75H22V5.25ZM18 5.25H14V6.75H18V5.25ZM17.25 2V6H18.75V2H17.25ZM17.25 6V10H18.75V6H17.25Z"
                      fill="#FF9900"
                    />
                    <path
                      d="M11.5 3C7.02166 3 4.78249 3 3.39124 4.39124C2 5.78249 2 8.02166 2 12.5C2 16.9783 2 19.2175 3.39124 20.6088C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.6088C21 19.2175 21 16.9783 21 12.5V12"
                      stroke="#FF9900"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2 14.1354C2.61902 14.0455 3.24484 14.0011 3.87171 14.0027C6.52365 13.9466 9.11064 14.7729 11.1711 16.3342C13.082 17.7821 14.4247 19.7749 15 22"
                      stroke="#FF9900"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 16.8962C19.8246 16.3009 18.6088 15.9988 17.3862 16.0001C15.5345 15.9928 13.7015 16.6733 12 18"
                      stroke="#FF9900"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <Swiper
                slidesPerView={3.5}
                spaceBetween={20}
                freeMode={true}
                modules={[FreeMode]}
                className="mySwiper px-5"
              >
                {[...imagesProduct].length === 0 && (
                  <div className="flex items-center gap-2 justify-center text-primary mt-5">
                    Album rỗng
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-7"
                      color={"currentColor"}
                      fill={"none"}
                    >
                      <path
                        d="M5.32171 9.6829C7.73539 5.41196 8.94222 3.27648 10.5983 2.72678C11.5093 2.42437 12.4907 2.42437 13.4017 2.72678C15.0578 3.27648 16.2646 5.41196 18.6783 9.6829C21.092 13.9538 22.2988 16.0893 21.9368 17.8293C21.7376 18.7866 21.2469 19.6548 20.535 20.3097C19.241 21.5 16.8274 21.5 12 21.5C7.17265 21.5 4.75897 21.5 3.46496 20.3097C2.75308 19.6548 2.26239 18.7866 2.06322 17.8293C1.70119 16.0893 2.90803 13.9538 5.32171 9.6829Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M11.992 16H12.001"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 13L12 8.99997"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
                {[...imagesProduct].length > 0 &&
                  [...imagesProduct].map((file, index) => {
                    return (
                      <SwiperSlide className="pb-1 px-0.5" key={index + 1}>
                        <div className="flex-shrink-0 w-[65px] h-[65px] relative">
                          <div className="w-full h-full rounded-full border overflow-hidden">
                            <img
                              className="w-full h-full object-cover"
                              src={
                                typeof file === "string"
                                  ? file
                                  : URL.createObjectURL(file)
                              }
                              loading="lazy"
                            />
                          </div>
                          <button
                            type="button"
                            className="absolute top-0 right-0 hover:bg-white p-1 rounded-full hover:text-[#ed6c03] bg-primary text-white shadow-sm"
                            onClick={() => {
                              if (typeof file === "string") {
                                handleRemoveImagesProductUrl(file);
                              } else {
                                handleRemoveImagesProductBlob(file.name);
                              }
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="size-3.5"
                              color={"currentColor"}
                              fill={"none"}
                            >
                              <path
                                d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div>
            <div className="col-span-8">
              <div className="mb-2 flex gap-1">
                <Label htmlFor="desc-product" value="Mô tả sản phẩm" />
                <span className="text-primary block text-sm">
                  {!descProduct && "(*)"}
                </span>
              </div>
              <JoditEditor
                value={descProduct}
                ref={editor}
                onBlur={(e) => {
                  setDescProduct(e);
                  setValue("description", e);
                }}
                config={configEditor as any}
              />
            </div>
          </div>
          <div className="flex gap-16">
            <div className="flex gap-3 items-center">
              <div className="block">
                <Label htmlFor="status-product" value="Trạng thái" />
              </div>
              <div>
                <ToggleSwitch
                  sizing={"sm"}
                  id="status-product"
                  checked={watch("is_active")}
                  {...register("is_active")}
                  onChange={(e) => {
                    setValue("is_active", e);
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="block">
                <Label htmlFor="featured-product" value="Nổi bật" />
              </div>
              <div>
                <ToggleSwitch
                  sizing={"sm"}
                  id="featured-product"
                  checked={watch("is_featured")}
                  {...register("is_featured")}
                  onChange={(e) => {
                    setValue("is_featured", e);
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="block">
                <Label htmlFor="good-deal-product" value="Giá tốt" />
              </div>
              <div>
                <ToggleSwitch
                  sizing={"sm"}
                  id="good-deal-product"
                  checked={watch("is_good_deal")}
                  {...register("is_good_deal")}
                  onChange={(e) => {
                    setValue("is_good_deal", e);
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="block">
                <Label htmlFor="is_variant-product" value="Có biến thể" />
              </div>
              <div>
                <ToggleSwitch
                  sizing={"sm"}
                  id="is_variant-product"
                  checked={watch("is_variant")}
                  {...register("is_variant")}
                  onChange={(e) => {
                    setValue("is_variant", e);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {variantFields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className="bg-white border p-3 rounded-[5px] relative space-y-3"
                >
                  <div className="grid grid-cols-3 gap-[15px]">
                    <div>
                      <div className="mb-2 flex gap-1">
                        <Label htmlFor="price-product" value="Giá" />
                        {errors.variants?.[index]?.price && (
                          <span className="text-primary block text-sm">
                            {errors.variants[index].price?.message}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="Giá"
                        id="price-product"
                        min={0}
                        {...register(`variants.${index}.price`, {
                          valueAsNumber: true,
                        })}
                        className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
                      />
                    </div>
                    <div>
                      <div className="mb-2 flex gap-1">
                        <Label htmlFor="sale_price-product" value="Giá sale" />
                        {errors.variants?.[index]?.price && (
                          <span className="text-primary block text-sm">
                            {errors.variants[index].sale_price?.message}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="Giá sale"
                        id="sale_price-product"
                        min={0}
                        {...register(`variants.${index}.sale_price`, {
                          valueAsNumber: true,
                        })}
                        className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
                      />
                    </div>
                    {/* <div>
                      <div className="flex">
                        <Label htmlFor="quality-product" value="Số lượng" />
                      </div>
                      <input
                        type="number"
                        placeholder="Số lượng"
                        id="quality-product"
                        {...register(`variants.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                        className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
                      />
                    </div> */}
                    <div>
                      <div className="flex mb-2">
                        <Label htmlFor="end-sale" value="Sale kết thúc sau" />
                      </div>
                      <Controller
                        name={`variants.${index}.end_sale`}
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            placeholder="Sale kết thúc sau"
                            showTime
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date, dateString) => {
                              field.onChange(dateString);
                            }}
                            className="h-[35px] w-full"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <Attribute_Value_Variant index={index} />
                  {index > 0 && (
                    <button
                      type="button"
                      className="absolute right-1 -top-2 bg-white shadow-sm rounded-full p-1 text-[#ed6c03] transition-all hover:bg-primary hover:text-white"
                      onClick={() => {
                        removeVariant(index);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="size-3.5"
                        color={"currentColor"}
                        fill={"none"}
                      >
                        <path
                          d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => {
                appendVariant({
                  price: null!,
                  sale_price: null!,
                  end_sale: null!,
                  image: null!,
                  attribute_values: [{}],
                });
              }}
              className="mx-auto w-fit block"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-7"
                color={"#ff9900"}
                fill={"none"}
              >
                <path
                  d="M12 8V16M16 12L8 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            <ButtonSubmit
              content={`${AddOrUpdate === "ADD" ? "Thêm" : "Sửa"} sản phẩm`}
            />
          </div>
        </form>
      </LoadingOverlay>
    </FormProvider>
  );
};

export default FormAddOrUpdateProduct;
