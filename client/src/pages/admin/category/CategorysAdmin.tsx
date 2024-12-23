import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ICategory } from "../../../interfaces/ICategory";
import instance from "../../../instance/instance";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { Table } from "flowbite-react";
import slugify from "react-slugify";
import { Avatar, ConfigProvider, Modal, Switch, Upload } from "antd";
import type { MenuProps, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import axios from "axios";
import Highlighter from "react-highlight-words";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
import { Input } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { Pagination, Dropdown } from "antd";
import { IMeta } from "../../../interfaces/IMeta";
import ButtonExport from "../../../components/Admin/Button/ButtonExport";
const CategoryList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const preset_key = import.meta.env.VITE_PRESET_KEY_CLOADINARY;
  const cloud_name = import.meta.env.VITE_CLOUD_NAME_CLOADINARY;
  const image_type = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml",];
  const [addOrupdate, SetAddOrUpdate] = useState("ADD");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [idUpdate, setIdUpdate] = useState<number>();
  const [isActive, setActive] = useState(false);
  const [valSearch, SetValSearch] = useState<string>("");
  const { Search } = Input;
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  //xử lý lấy ảnh
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ICategory>();

  const fetchCategories = async () => {
    try {
      setSearchParams({ page: String(page) });
      const { data } = await instance.get(`category/?page=${page}`);
      setCategories(data.data);
      setMeta(data.meta);
    } catch (error) {
      toast.error("Không thể tải danh mục.", error!);
    }
  };
  const handleCancel = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    fetchCategories();
  }, [page]);

  useEffect(() => {
    setFileList([]);
    SetAddOrUpdate("ADD");
    reset({
      name: "",
      is_active: true,
    });
  }, [openModal === false]);

  const items: MenuProps["items"] = [
    {
      key: "all",
      label: "Tất cả",
      onClick: () => setStatusFilter("all"),
    },
    {
      key: "active",
      label: "Đang hiển thị",
      onClick: () => setStatusFilter("active"),
    },
    {
      key: "inactive",
      label: "Đang ẩn",
      onClick: () => setStatusFilter("inactive"),
    },
  ];
  //xử lý lọc trnagj thái
  const filteredCategories = categories.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(valSearch.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? item.is_active
        : !item.is_active;

    return matchesSearch && matchesStatus;
  });
  //Hàm xử lí xóa danh mục
  const handleDelete = async (_id: number) => {
    try {
      const willDelete = await swal({
        title: "Bạn có chắc chắn muốn xóa?",
        text: "Hành động này sẽ không thể hoàn tác!",
        icon: "warning",
        buttons: ["Hủy", "Xóa"],
        dangerMode: true,
        className: "my-swal",
      });
      if (willDelete) {
        await instance.delete(`category/hard-delete/${_id}`);
        const { data } = await instance.get(`category/?page=${page}`);
        if (data.data.length === 0 && page > 1) {
          const newPage = page - 1;
          setSearchParams({ page: String(newPage) });
          const newData = await instance.get(`category/?page=${newPage}`);
          setCategories(newData.data.data);
          setMeta(newData.data.meta);
        } else {
          setCategories(data.data);
          setMeta(data.meta);
        }
        toast.success("Xoá thành công !");
      }
    } catch (error) {
      toast.error("Còn sản phẩm trong danh mục", error!);
    }
  };
  //fill data để xử lý sửa danh mục
  const fillDataFormUpdate = async (id: number) => {
    try {
      const { data } = await instance.get(`category/${id}`);
      reset({
        name: data.data.name,
        slug: data.data.slug,
        is_active: data.data.is_active,
      });
      if (data.data.image) {
        setFileList([
          {
            uid: "1",
            name: data.data.name,
            url: data.data.image,
            status: "done",
          },
        ]);
      }
      setIdUpdate(id);
      SetAddOrUpdate("UPDATE");
    } catch (error) {
      toast.error("Có lỗi xảy ra", error!);
    }
  };
  // xử lý thêm or sửa danh mục
  const onSubmit = async (dataForm: ICategory) => {
    try {
      // xử lý upload ảnh
      let imageUrl = null;
      if (fileList[0]?.url) {
        setActive(true);
        imageUrl = fileList[0]?.url;
      } else {
        setActive(true);
        const imageupload = new FormData();
        const check_type_image = image_type.some(
          (item) => fileList[0].type === item
        );
        if (!check_type_image) {
          toast.error("Chỉ hỗ trợ định dạng .jpg, .jpeg, .png và .webp");
          return;
        }
        // Kiểm tra kích thước file (giới hạn 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if ((fileList[0]?.size as number) > maxSize) {
          toast.error("Kích thước ảnh quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
          return;
        }
        imageupload.append("file", fileList[0].originFileObj as Blob);
        imageupload.append("upload_preset", preset_key);
        const uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          imageupload
        );
        imageUrl = uploadResponse.data.secure_url;
      }
      if (addOrupdate == "ADD") {
        // xử lý thêm danh phẩm
        const formData = new FormData();
        formData.append("name", dataForm.name);
        formData.append("slug", slugify(watch("name")));
        formData.append("is_active", dataForm.is_active ? "1" : "0");
        formData.append("image", imageUrl);
        await instance.post("category", formData);
        reset();
        setFileList([]);
        toast.success("Thêm danh mục thành công");
        setOpenModal(false);
        fetchCategories();
        setActive(false);
      } else if (addOrupdate === "UPDATE") {
        // xử lý sửa danh phẩm
        await instance.put(`category/${idUpdate}`, {
          name: dataForm.name,
          slug: slugify(watch("name")),
          is_active: dataForm.is_active,
          image: imageUrl,
        });
        toast.success("Sửa danh mục thành công");
        setOpenModal(false);
        fetchCategories();
        setFileList([]);
        setActive(false);
        SetAddOrUpdate("ADD");
      }
    } catch (error) {
      setActive(false);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Đã xảy ra lỗi không mong muốn");
      }
    }
  };
  // xử lý update status
  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await instance.patch(`category/${id}/is-active`, {
        is_active: isActive ? 1 : 0,
      });
      fetchCategories();
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      toast.error(`Có lỗi xảy ra khi cập nhật trạng thái ${error}`);
    }
  };
  return (
    <div className="container mx-auto space-y-5 bg-util p-5 rounded-md">
      <div className="block space-y-4 md:flex justify-between md:space-y-0">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              setOpenModal(true);
            }}
            className="flex items-center gap-1 text-white py-2 px-3.5 bg-primary hover:bg-transparent hover:outline-primary hover:outline-1 hover:outline hover:text-primary transition-all rounded-sm text-sm"
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
            Thêm danh mục
          </button>
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            // placement="bottomRight"
          >
            <button className="bg-primary hover:bg-primary text-white text-sm py-2 px-3.5 rounded-sm focus:ring-primary flex items-center">
              {statusFilter === "all"
                ? "Tất cả"
                : statusFilter === "active"
                ? "Đang hiển thị"
                : "Đang ẩn"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                color="currentColor"
                fill="none"
                className="ml-2 size-5"
              >
                <path
                  d="M13 4L3 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 19L3 19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 19L17 19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 11.5L11 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 4L19 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 11.5L3 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.5 2C14.9659 2 15.1989 2 15.3827 2.07612C15.6277 2.17761 15.8224 2.37229 15.9239 2.61732C16 2.80109 16 3.03406 16 3.5L16 4.5C16 4.96594 16 5.19891 15.9239 5.38268C15.8224 5.62771 15.6277 5.82239 15.3827 5.92388C15.1989 6 14.9659 6 14.5 6C14.0341 6 13.8011 6 13.6173 5.92388C13.3723 5.82239 13.1776 5.62771 13.0761 5.38268C13 5.19891 13 4.96594 13 4.5L13 3.5C13 3.03406 13 2.80109 13.0761 2.61732C13.1776 2.37229 13.3723 2.17761 13.6173 2.07612C13.8011 2 14.0341 2 14.5 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.5 17C12.9659 17 13.1989 17 13.3827 17.0761C13.6277 17.1776 13.8224 17.3723 13.9239 17.6173C14 17.8011 14 18.0341 14 18.5L14 19.5C14 19.9659 14 20.1989 13.9239 20.3827C13.8224 20.6277 13.6277 20.8224 13.3827 20.9239C13.1989 21 12.9659 21 12.5 21C12.0341 21 11.8011 21 11.6173 20.9239C11.3723 20.8224 11.1776 20.6277 11.0761 20.3827C11 20.1989 11 19.9659 11 19.5L11 18.5C11 18.0341 11 17.8011 11.0761 17.6173C11.1776 17.3723 11.3723 17.1776 11.6173 17.0761C11.8011 17 12.0341 17 12.5 17Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 9.5C9.96594 9.5 10.1989 9.5 10.3827 9.57612C10.6277 9.67761 10.8224 9.87229 10.9239 10.1173C11 10.3011 11 10.5341 11 11L11 12C11 12.4659 11 12.6989 10.9239 12.8827C10.8224 13.1277 10.6277 13.3224 10.3827 13.4239C10.1989 13.5 9.96594 13.5 9.5 13.5C9.03406 13.5 8.80109 13.5 8.61732 13.4239C8.37229 13.3224 8.17761 13.1277 8.07612 12.8827C8 12.6989 8 12.4659 8 12L8 11C8 10.5341 8 10.3011 8.07612 10.1173C8.17761 9.87229 8.37229 9.67761 8.61732 9.57612C8.80109 9.5 9.03406 9.5 9.5 9.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Dropdown>
        </div>
        <div className="flex items-center gap-2">
          <ButtonExport
            data={categories}
            nameButton="Xuất excel"
            nameSheet="Danh mục"
            nameFile="danhmuc.xlsx"
          />
          <Search
            placeholder="Tên danh mục"
            allowClear
            onChange={(e) => {
              SetValSearch(e.target.value);
            }}
            size="large"
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg">
        <Table className="border-b border-[#E4E7EB]">
          <Table.Head className="text-center">
            <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Tên Danh Mục
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Slug
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Số sản phẩm
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Ảnh
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Ngày tạo
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Trạng thái
            </Table.HeadCell>
            <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
              Hành động
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredCategories.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={6}>
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
                    <p>Không có danh mục nào</p>
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredCategories.map((category, index) => {
                return (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
                    key={category.id}
                  >
                    {/* <Table.Cell className="font-medium text-primary text-base border-[#f5f5f5] border-r ">
                          {index + 1}
                        </Table.Cell> */}
                    <Table.Cell className="whitespace-nowrap font-medium text-left dark:text-white">
                      <Highlighter
                        highlightClassName="YourHighlightClass"
                        searchWords={[valSearch.toLowerCase()]}
                        autoEscape={true}
                        textToHighlight={category.name}
                      />
                    </Table.Cell>
                    <Table.Cell>{category.slug}</Table.Cell>
                    <Table.Cell>{category.product_count}</Table.Cell>
                    <Table.Cell>
                      <Avatar src={category.image} size={"large"} />
                    </Table.Cell>
                    <Table.Cell className="text-nowrap">
                      {dayjs(category.created_at).format("DD-MM-YYYY")}
                    </Table.Cell>
                    <Table.Cell>
                      <ConfigProvider
                        theme={{
                          token: {
                            colorPrimary: "#ff9900",
                          },
                        }}
                      >
                        <Switch
                          checkedChildren={<CheckOutlined />}
                          unCheckedChildren={<CloseOutlined />}
                          checked={category.is_active}
                          onChange={() =>
                            handleToggleActive(
                              category.id!,
                              !category.is_active
                            )
                          }
                        />
                      </ConfigProvider>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2 justify-center">
                        <button
                          className="bg-util shadow py-1.5 px-3 rounded-md"
                          onClick={() => {
                            setOpenModal(true);
                            SetAddOrUpdate("UPDATE");
                            fillDataFormUpdate(category.id!);
                          }}
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
                            handleDelete(category.id!);
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
        title={`${addOrupdate === "ADD" ? "THÊM DANH MỤC" : "SỬA DANH MỤC"}`}
        open={openModal}
        onCancel={handleCancel}
        width={410}
        okText={`${addOrupdate === "ADD" ? "Thêm mới" : "Cập nhật"}`}
        cancelText="Trở lại"
        onOk={handleSubmit(onSubmit)}
      >
        <LoadingOverlay
          active={isActive}
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
          <form className="mt-7">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Tên Danh Mục
              </label>
              <input
                placeholder="Tên danh mục"
                type="text"
                {...register("name", {
                  required: "Tên danh mục là bắt buộc",
                  minLength: {
                    value: 6,
                    message: "Tên danh mục phải có ít nhất 6 ký tự",
                  },
                })}
                id="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.name && (
                <span className="text-primary text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700"
              >
                Slug
              </label>
              <input
                type="text"
                id="slug"
                value={slugify(watch("name"))}
                disabled
                placeholder="Slug"
                {...register("slug")}
                className="mt-1 block w-full bg-slate-100 text-[#aeaeae] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.slug && (
                <span className="text-primary text-sm">
                  {errors.slug.message}
                </span>
              )}
            </div>
            <div className="mb-4 flex items-start">
              <ImgCrop rotationSlider>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  beforeUpload={() => false}
                >
                  {fileList.length < 1 && (
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path d="M28 8H20L18 12H10a2 2 0 00-2 2v24a2 2 0 002 2h28a2 2 0 002-2V14a2 2 0 00-2-2h-8l-2-4zM16 28a4 4 0 118 0 4 4 0 01-8 0zm10 0a4 4 0 118 0 4 4 0 01-8 0zm-6-4l-6 8h20l-6-8H20z" />
                    </svg>
                  )}
                </Upload>
              </ImgCrop>
            </div>
            <span className="block text-primary text-sm mb-5">
              {fileList.length <= 0 ? "Ảnh là bắt buộc *" : ""}
            </span>
            <div className="mb-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register("is_active")}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary peer-checked:after:border-white" />
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Kích Hoạt
                </span>
              </label>
            </div>
          </form>
        </LoadingOverlay>
      </Modal>
    </div>
  );
};
export default CategoryList;
