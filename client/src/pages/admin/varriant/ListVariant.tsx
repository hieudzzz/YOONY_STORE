import { Label, Table } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import instance from "../../../instance/instance";
import { AttributeContext } from "../../../contexts/AttributeContext";
import { ConfigProvider, Modal, Pagination, Select } from "antd";
import { IMeta } from "../../../interfaces/IMeta";
import { useSearchParams } from "react-router-dom";
import { Input } from "antd";
import Highlighter from "react-highlight-words";
import { IAttribute } from "../../../interfaces/IAttribute";
import { useForm } from "react-hook-form";
import { IAttributeValue } from "../../../interfaces/IAttributeValue";
import { toast } from "react-toastify";
import axios from "axios";
const ListVariant = () => {
  const { attributes, dispatch } = useContext(AttributeContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  const [valSearch, SetValSearch] = useState<string>("");
  const { Search } = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attribute, setAttribute] = useState<IAttribute>();
  const [editingValueId, setEditingValueId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [idAttribute, setIdAttribute] = useState<number>();

  const handleEditValue = (valueAttribute: IAttributeValue) => {
    setEditingValueId(valueAttribute.id!);
    setEditingValue(valueAttribute.value!);
  };

  const handleUpdateValue = async () => {
    try {
      const { data } = await instance.put(`attribute-value/${editingValueId}`, {
        value: editingValue,
      });

      if (data) {
        toast.success("Sửa giá trị thuộc tính thành công");
        if (attribute?.attribute_values) {
          const updatedValues = attribute.attribute_values.map((value) =>
            value.id === editingValueId
              ? { ...value, value: editingValue }
              : value
          );

          setAttribute({
            ...attribute,
            attribute_values: updatedValues,
          });
        }
        setEditingValueId(null);
        setEditingValue("");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật giá trị:", error);
    }
  };

  const handleRemoveAttibuteValue = async (idAttributeValue: number) => {
    try {
      const { data } = await instance.delete();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Đã xảy ra lỗi không mong muốn");
      }
    }
  };
  const handleRemoveAttibute = async (idAttribute: number) => {
    try {
      const { data } = await instance.delete(`attribute/${idAttribute}`);
      if (data) {
        dispatch({
          type: "DELETE",
          payload: idAttribute,
        });
        toast.success("Xoá thuộc tính thành công");
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.messages);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Đã xảy ra lỗi không mong muốn");
      }
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IAttribute>();

  useEffect(() => {
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const {
          data: { data: response },
        } = await instance.get("attribute");
        setMeta(response);
        dispatch({
          type: "LIST",
          payload: response.data,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const handleShowDetailAttribute = async (idAttribute: number) => {
    try {
      setIdAttribute(idAttribute);
      setIsModalOpen(true);
      const {
        data: { data: response },
      } = await instance.get(`admin/attribute/${idAttribute}`);
      setAttribute(response);
      reset({
        name: response.name,
        type: response.type,
      });
    } catch (error) {
      setIdAttribute(undefined);
      console.log(error);
    }
  };
  const handleUpdateAttribute = async (dataForm: IAttribute) => {
    try {
      const {
        data: { data: response },
      } = await instance.put(`attribute/${idAttribute}`, dataForm);
      if (response) {
        dispatch({
          type: "UPDATE",
          payload: response,
        });
        toast.success("Sửa thuộc tính thành công");
        setIsModalOpen(false);
      }
    } catch (error) {
      setIsModalOpen(false);
      setIdAttribute(undefined);
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-util p-5 rounded-md space-y-5">
      <div className="w-fit">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#ff9900",
            },
          }}
        >
          <Search
            placeholder="Tên thuộc tính"
            allowClear
            onChange={(e) => {
              SetValSearch(e.target.value);
            }}
            size="large"
          />
        </ConfigProvider>
      </div>
      <div className="overflow-x-auto">
        <Table className="border-b border-[#E4E7EB]">
          <Table.Head className="text-center">
            <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
              STT
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Tên thuộc tính
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Slug
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Kiểu
            </Table.HeadCell>
            <Table.HeadCell
              className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap"
              style={{
                width: "25%",
              }}
            >
              Hành động
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {attributes.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={8}>
                  <div className="flex flex-col items-center text-secondary/20 space-y-2 justify-center min-h-[50vh]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-16"
                      viewBox="0 0 64 41"
                    >
                      <g
                        fill="none"
                        fillRule="evenodd"
                        transform="translate(0 1)"
                      >
                        <ellipse
                          cx="32"
                          cy="33"
                          fill="#f5f5f5"
                          rx="32"
                          ry="7"
                        ></ellipse>
                        <g fillRule="nonzero" stroke="#d9d9d9">
                          <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                          <path
                            fill="#fafafa"
                            d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                          ></path>
                        </g>
                      </g>
                    </svg>
                    <p>Không có thuộc tính nào</p>
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : (
              attributes
                .filter((item) =>
                  item.name.toLowerCase().includes(valSearch.toLowerCase())
                )
                .map((attribute, index) => {
                  return (
                    <Table.Row key={attribute.id}>
                      <Table.Cell className="border-r">{index + 1}</Table.Cell>
                      <Table.Cell className="border border-t-0 border-b-0 font-medium">
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[valSearch.toLowerCase()]}
                          autoEscape={true}
                          textToHighlight={attribute.name}
                        />
                      </Table.Cell>
                      <Table.Cell className="border border-t-0 border-b-0">
                        {attribute.slug}
                      </Table.Cell>
                      <Table.Cell className="border border-t-0 border-b-0">
                        {attribute.type}
                      </Table.Cell>
                      <Table.Cell className="border-r-0 border-t-0 border-b-0">
                        <div className="flex gap-2 justify-center">
                          <button
                            className="bg-util shadow py-1.5 px-3 rounded-md"
                            onClick={() =>
                              handleShowDetailAttribute(attribute.id!)
                            }
                          >
                            <svg
                              className="size-5"
                              fill="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                stroke="#1FD178"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit="10"
                                strokeWidth="1.5"
                                d="M11.05 3l-6.842 7.242c-.258.275-.508.816-.558 1.191l-.308 2.7c-.109.975.591 1.642 1.558 1.475l2.683-.458c.375-.067.9-.342 1.159-.625l6.841-7.242c1.184-1.25 1.717-2.675-.125-4.416C13.625 1.142 12.233 1.75 11.05 3zM9.908 4.208A5.105 5.105 0 0014.45 8.5M2.5 18.333h15"
                              ></path>
                            </svg>
                          </button>
                          <button
                            className="bg-util shadow py-1.5 px-3 rounded-md"
                            onClick={() => {
                              swal({
                                title: "Xoá thuộc tính",
                                text: "Sau khi xoá thuộc tính không thể khôi phục!",
                                icon: "warning",
                                buttons: ["Hủy", "Xoá"],
                                dangerMode: true,
                                className: "my-swal",
                              }).then((willRemove) => {
                                if (willRemove) {
                                  handleRemoveAttibute(attribute.id!);
                                }
                              });
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="size-5"
                              color={"#F31260"}
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
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
            )}
          </Table.Body>
        </Table>
        <Modal
          title="Chi tiết thuộc tính"
          open={isModalOpen}
          onOk={handleSubmit(handleUpdateAttribute)}
          onCancel={handleCancel}
          okText="Cập nhật"
          cancelText="Trở lại"
        >
          <form action="" className="my-8 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name-attribute" value="Tên thuộc tính" />
              <input
                type="text"
                placeholder="Tên thuộc tính"
                id="name-attribute"
                {...register("name", {
                  required: "Bắt buộc !",
                  minLength: {
                    value: 3,
                    message: "Tối thiếu 3 kí tự",
                  },
                })}
                className="block focus:!border-primary/50 h-[35px] text-sm placeholder-[#00000040] border-input rounded-[5px] w-full focus:!shadow-none"
              />
              <span className="text-xs text-primary block">
                {errors.name?.message}
              </span>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="type-attribute" value="Kiểu thuộc tính" />
              </div>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#ff9900",
                  },
                }}
              >
                <Select
                  {...register("type")}
                  onChange={(value) => setValue("type", value)}
                  showSearch
                  value={watch("type")}
                  style={{ width: "100%", height: "35px" }}
                  placeholder="Kiểu thuộc tính"
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={[
                    {
                      value: "select",
                      label: "Select",
                    },
                    {
                      value: "color",
                      label: "Color",
                    },
                    {
                      value: "button",
                      label: "Button",
                    },
                    {
                      value: "radio",
                      label: "Radio",
                    },
                  ]}
                />
              </ConfigProvider>
            </div>
            <div className="w-full">
              <div className="mb-2 block">
                <Label
                  htmlFor="value-attribute"
                  value="Các giá trị thuộc tính"
                />
              </div>
              <Table>
                <Table.Head className="text-center">
                  <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                    STT
                  </Table.HeadCell>
                  <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
                    Giá trị
                  </Table.HeadCell>
                  <Table.HeadCell
                    className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap"
                    style={{
                      width: "25%",
                    }}
                  >
                    Hành động
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {attribute?.attribute_values?.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={6}>
                        <div className="flex flex-col items-center text-secondary/20 space-y-2 justify-center min-h-[10vh]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-14"
                            viewBox="0 0 64 41"
                          >
                            <g
                              fill="none"
                              fillRule="evenodd"
                              transform="translate(0 1)"
                            >
                              <ellipse
                                cx="32"
                                cy="33"
                                fill="#f5f5f5"
                                rx="32"
                                ry="7"
                              ></ellipse>
                              <g fillRule="nonzero" stroke="#d9d9d9">
                                <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                                <path
                                  fill="#fafafa"
                                  d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                                ></path>
                              </g>
                            </g>
                          </svg>
                          <p>Không có giá trị nào</p>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    attribute?.attribute_values?.map(
                      (valueAttribute, index) => {
                        return (
                          <Table.Row key={valueAttribute?.id}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>
                              {editingValueId === valueAttribute.id ? (
                                <Input
                                  value={editingValue}
                                  onChange={(e) =>
                                    setEditingValue(e.target.value)
                                  }
                                  className="h-[35px] border border-[#f1f1f1] rounded-sm"
                                  placeholder="Nhập giá trị thuộc tính"
                                />
                              ) : (
                                valueAttribute.value
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              <div className="flex gap-2">
                                {editingValueId === valueAttribute.id ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={handleUpdateValue}
                                      className="text-util bg-primary py-1 rounded-sm px-2 text-sm"
                                    >
                                      Lưu
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingValueId(null)}
                                      className="text-red-500"
                                    >
                                      Hủy
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      className="text-util bg-primary py-1 rounded-sm px-2 text-sm"
                                      onClick={() =>
                                        handleEditValue(valueAttribute)
                                      }
                                    >
                                      Sửa
                                    </button>
                                    <button
                                      type="button"
                                      className="text-red-500"
                                    >
                                      Xoá
                                    </button>
                                  </>
                                )}
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        );
                      }
                    )
                  )}
                </Table.Body>
              </Table>
            </div>
          </form>
        </Modal>
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
    </div>
  );
};

export default ListVariant;
