import { useContext, useState, useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { IProduct } from "../../../interfaces/IProduct";
import { Label } from "flowbite-react";
import { Select, Upload } from "antd";
import { AttributeContext } from "../../../contexts/AttributeContext";
import instance from "../../../instance/instance";
import ImgCrop from "antd-img-crop";
import type { UploadFile, UploadProps } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { debounce } from 'lodash';
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
type Prop = {
  index: number;
};

const Attribute_Value_Variant = ({ index }: Prop) => {
  const { attributes } = useContext(AttributeContext);
  const { control, setValue, getValues,formState:{errors} } = useFormContext<IProduct>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${index}.attribute_values` as any,
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const onChange: UploadProps["onChange"] = ({
    fileList: newFileList,
    file,
  }) => {
    if (file.status !== "removed") {
      setFileList(newFileList);
      handleUploadImageVariantColor(file);
    } else {
      setFileList([]);
      setValue(`variants.${index}.image`, null);
    }
  };

  const [attributeValuesMap, setAttributeValuesMap] = useState<{
    [key: number]: { id: number; value: string }[];
  }>({});

  const watchedFields = useWatch({
    control,
    name: `variants.${index}.attribute_values`,
  });

  const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);
  const [attributeValuesCache, setAttributeValuesCache] = useState<{
    [key: number]: { id: number; value: string }[];
  }>({});

  const debouncedInitialize = debounce(async () => {
    const currentVariant = getValues(`variants.${index}`);
    if (currentVariant && currentVariant.attribute_values) {
      const initialSelectedAttributes = currentVariant.attribute_values
        .map((av) => av.attribute_id)
        .filter(Boolean);
      setSelectedAttributes(initialSelectedAttributes);
  
      const initialAttributeValuesMap = {};
      for (let i = 0; i < currentVariant.attribute_values.length; i++) {
        const av = currentVariant.attribute_values[i];
        if (av.attribute_id) {
          let values;
          if (attributeValuesCache[av.attribute_id]) {
            values = attributeValuesCache[av.attribute_id];
          } else {
            values = await getAttributeValue(av.attribute_id);
            setAttributeValuesCache(prev => ({...prev, [av.attribute_id]: values}));
          }
          initialAttributeValuesMap[i] = values;
          setValue(`variants.${index}.attribute_values.${i}.attribute_value_id`, av.attribute_value_id);
  
          const attribute = attributes.find(attr => attr.id === av.attribute_id);
          // console.log(attribute?.type);
          if (attribute?.type === 'color' && currentVariant.image) {
            setFileList([
              {
                uid: '1',
                name: 'image.png',
                status: 'done',
                url: currentVariant.image,
              },
            ]);
          }
        }
      }
      setAttributeValuesMap(initialAttributeValuesMap);
    }
  }, 300);


  useEffect(() => {
    debouncedInitialize();
    return () => {
      debouncedInitialize.cancel(); 
    };
  }, [getValues, index,setFileList]);

  const remainingAttributes = attributes.filter(
    (attribute) => !selectedAttributes.includes(attribute.id!)
  );

  const getAttributeValue = async (attribute_id: number, retries = 3, delay = 1000) => {
    try {
      const data = await instance.get(`attribute-values/${attribute_id}`);
      return data.data.attribute_values;
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying... Attempts left: ${retries - 1}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return getAttributeValue(attribute_id, retries - 1, delay * 2);
      }
      console.log(error);
      return [];
    }
  };

  const handleAttributeChange = async (
    attributeId: number,
    attrIndex: number
  ) => {
    const selectedAttribute = attributes.find(
      (attr) => attr.id === attributeId
    );
    const values = await getAttributeValue(attributeId);

    setAttributeValuesMap((prev) => ({
      ...prev,
      [attrIndex]: values,
    }));

    setValue(`variants.${index}.attribute_values.${attrIndex}`, {
      attribute_id: attributeId,
      attribute_value_id: null,
      type: selectedAttribute?.type,
    });

    setSelectedAttributes((prev) => {
      const newSelected = [...prev];
      newSelected[attrIndex] = attributeId;
      return newSelected;
    });
  };

  const handleRemoveAttribute = (attrIndex: number) => {
    const currentValues = getValues(`variants.${index}.attribute_values`);

    remove(attrIndex);

    setSelectedAttributes((prev) => {
      const newSelected = [...prev];
      newSelected.splice(attrIndex, 1);
      return newSelected;
    });

    setAttributeValuesMap((prev) => {
      const newMap = { ...prev };
      for (let i = attrIndex; i < Object.keys(newMap).length - 1; i++) {
        newMap[i] = newMap[i + 1];
      }
      delete newMap[Object.keys(newMap).length - 1];
      return newMap;
    });

    currentValues.forEach((value, idx) => {
      if (idx > attrIndex) {
        setValue(
          `variants.${index}.attribute_values.${idx - 1}`,
          currentValues[idx]
        );
      }
    });
  };

  useEffect(() => {
    if (fields.length === 0 && attributes.length > 0) {
      append({});
    }
  }, [fields, append, attributes]);

  const handleUploadImageVariantColor = async (file: UploadFile) => {
    try {
      if (file) {
        const imageupload = new FormData();
        imageupload.append("file", file as any);
        imageupload.append(
          "upload_preset",
          import.meta.env.VITE_PRESET_KEY_CLOADINARY
        );
        setLoading(true)
        const uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME_CLOADINARY
          }/image/upload`,
          imageupload
        );
        if (uploadResponse.data.secure_url) {
          setLoading(false)
          toast.success("Upload ảnh biến thể thành công!");
          setValue(`variants.${index}.image`, uploadResponse.data.secure_url);
        }
      }
    } catch (error) {
      toast.error(`Error uploading image`, error);
    }
  };

  return (
    <>
      {fields.map((field, attrIndex) => {
        const watchedField = watchedFields?.[attrIndex] || {};
        const optionsAttributeValue =
          attributeValuesMap[attrIndex]?.map((value) => ({
            value: value.id,
            label: value.value,
          })) || [];

        const availableAttributes = attributes.filter(
          (attribute) =>
            !selectedAttributes.includes(attribute.id) ||
            attribute.id === watchedField.attribute_id
        );

        const optionsAttribute = availableAttributes.map((attribute) => ({
          value: attribute.id,
          label: attribute.name,
          type: attribute.type,
        }));

        return (
          <div className="grid grid-cols-3 gap-[15px]" key={field.id}>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor={`attribute-${attrIndex}`}
                  value={`Tên thuộc tính ${attrIndex + 1}`}
                />
              </div>
              <Select
                value={watchedField.attribute_id}
                onChange={(e) => handleAttributeChange(e, attrIndex)}
                showSearch
                id={`attribute-${attrIndex}`}
                style={{ width: "100%", height: "35px" }}
                placeholder={`Tên thuộc tính ${attrIndex + 1}`}
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={optionsAttribute}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor={`attribute-value-${attrIndex}`}
                  value={`Giá trị thuộc tính ${attrIndex + 1}`}
                />
              </div>
              <Select
                value={watchedField.attribute_value_id}
                allowClear
                
                id={`attribute-value-${attrIndex}`}
                style={{ width: "100%", height: "35px" }}
                placeholder={`Giá trị thuộc tính ${attrIndex + 1}`}
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                onChange={(e) => {
                  setValue(
                    `variants.${index}.attribute_values.${attrIndex}.attribute_value_id`,
                    e
                  );
                }}
                options={optionsAttributeValue}
              />
            </div>
            <div className="flex items-end gap-3">
              {attrIndex === fields.length - 1 &&
                remainingAttributes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      append({});
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-6"
                      color={"#34C759"}
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
                        d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.5 8.5C2.86239 7.67056 3.3189 6.89166 3.85601 6.17677M6.17681 3.85598C6.89168 3.31888 7.67058 2.86239 8.5 2.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              {fields.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveAttribute(attrIndex);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-6"
                    color={"#FF9900"}
                    fill={"none"}
                  >
                    <path
                      d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9.5 16.5L9.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14.5 16.5L14.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
              {watchedField.type === "color" && (
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
                      width: "25px",
                      "& svg circle": {
                        stroke: "rgba(255, 153, 0,5)",
                        strokeWidth: "3px",
                      },
                    }),
                  }}
                >
                  <ImgCrop rotationSlider>
                    <Upload
                      beforeUpload={() => {
                        return false;
                      }}
                      listType="picture-card"
                      fileList={fileList}
                      onChange={onChange}
                      className="custom-upload"
                    >
                      {fileList.length < 1 && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="size-6"
                          color={"#ff9900"}
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
                      )}
                    </Upload>
                  </ImgCrop>
                </LoadingOverlay>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Attribute_Value_Variant;
