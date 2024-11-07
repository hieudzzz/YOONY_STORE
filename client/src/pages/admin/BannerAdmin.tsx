import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ICategory } from "../../interfaces/ICategory";
import instance from "../../instance/instance";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { Table, Modal } from "flowbite-react";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import axios from "axios";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
import { IBanner } from "../../interfaces/IBanners";
import { ToggleSwitch } from "flowbite-react";

const BannerList: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const [banners, setBanners] = useState<ICategory[]>([]);
    const preset_key = import.meta.env.VITE_PRESET_KEY_CLOADINARY;
    const cloud_name = import.meta.env.VITE_CLOUD_NAME_CLOADINARY;
    const image_type = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const [addOrupdate, SetAddOrUpdate] = useState("ADD");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [idUpdate, setIdUpdate] = useState<number>();
    const [isActive, setActive] = useState(false);
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
        reset,
        formState: { errors },
    } = useForm<IBanner>();

    const fetchBanners = async () => {
        try {
            const { data } = await instance.get("banners");
            setBanners(data.data);
            setStatus(data.data.is_active == 1 ? true : false);
            console.log(data);


        } catch (error) {
            console.error("Error fetching banners:", error);
            toast.error("Không thể tải banners.");
        }
    };
    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        setFileList([]);
        SetAddOrUpdate("ADD");
        reset({
            is_active: true
        });
    }, [openModal === false]);
    const [status, setStatus] = useState(false);
    const handleDelete = async (id: number) => {
        try {
            const willDelete = await swal({
                title: "Bạn có chắc chắn muốn xóa?",
                text: "Hành động này sẽ không thể hoàn tác!",
                icon: "warning",
                buttons: ["Hủy", "Xóa"],
                dangerMode: true,
            });
            if (willDelete) {
                await instance.delete(`banners/${id}`);
                fetchBanners();
                toast.success("Deleted");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra");
            console.log(error);
        }
    };

    const fillDataFormUpdate = async (id: number) => {
        try {
            const { data } = await instance.get(`banners/${id}`);
            console.log("data:", data)
            reset({
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
            toast.error("Có lỗi xảy ra");
            console.log(error);
        }
    };
    // xử lý thêm or sửa danh mục
    const onSubmit = async (dataForm: IBanner) => {
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
                console.log(fileList[0]);
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
                formData.append("is_active", dataForm.is_active ? "1" : "0");
                formData.append("image", imageUrl);
                console.log("is_active", dataForm.is_active ? "1" : "0");
                console.log("image", imageUrl);
                await instance.post("banners", formData);
                reset();
                setFileList([]);
                toast.success("Thêm banner thành công");
                setOpenModal(false);
                fetchBanners();
                setActive(false);
            } else if (addOrupdate === "UPDATE") {
                await instance.put(`banners/${idUpdate}`, {
                    is_active: dataForm.is_active,
                    image: imageUrl,
                });
                toast.success("Sửa banner thành công");
                setOpenModal(false);
                fetchBanners();
                setFileList([]);
                setActive(false);
                SetAddOrUpdate("ADD");
            }
        } catch (error) {
            setActive(false);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            } else if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("Đã xảy ra lỗi không mong muốn");
            }
        }
    };
    // xử lý update status
    const handleToggleActive = async (id: number, is_active: boolean) => {
        try {
            await instance.patch(`banners/${id}/is-active`, {
                is_active: is_active,
            });
            fetchBanners();
            toast.success("Cập nhật trạng thái thành công");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
            console.log(error);
        }
    };
    return (
        <div className="container mx-auto space-y-5">
            <div className="flex justify-between">
                <button
                    onClick={() => {
                        setOpenModal(true);
                    }}
                    className="flex items-center font-medium gap-1 text-white py-2 px-3.5 bg-primary hover:bg-transparent hover:outline-primary hover:outline-1 hover:outline hover:text-primary transition-all rounded-md text-sm"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                    THÊM BANNER
                </button>

            </div>
            <div className="overflow-x-auto rounded-lg">
                <Table hoverable>
                    <Table.Head className="text-center">
                        <Table.HeadCell className="bg-primary text-white text-sm font-medium">
                            STT
                        </Table.HeadCell>
                        <Table.HeadCell className="bg-primary text-white text-sm font-medium">
                            Hình Ảnh
                        </Table.HeadCell>
                        <Table.HeadCell className="bg-primary text-white text-sm font-medium">
                            Kích hoạt
                        </Table.HeadCell>
                        <Table.HeadCell className="bg-primary text-white text-sm font-medium">
                            Hành động
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {banners
                            .map((banner, index) => {
                                return (
                                    <Table.Row
                                        className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
                                        key={banner.id}
                                    >
                                        <Table.Cell className="font-medium text-primary text-base border-[#f5f5f5] border-r ">
                                            {index + 1}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <img
                                                src={banner.image}
                                                className="h-10 mx-auto w-10 rounded-full object-cover"
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <ToggleSwitch checked={banner.is_active}
                                             className="mx-auto w-fit"
                                                onChange={() => {
                                                    setStatus(!banner.is_active)
                                                    handleToggleActive(
                                                        banner.id!,
                                                        !banner.is_active
                                                    )
                                                }
                                                } />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    className="bg-util shadow py-1.5 px-3 rounded-md"
                                                    onClick={() => {
                                                        setOpenModal(true);
                                                        SetAddOrUpdate("UPDATE");
                                                        fillDataFormUpdate(banner.id!);
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
                                                        handleDelete(banner.id!);
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
                            })}
                    </Table.Body>
                </Table>
            </div>
            <Modal
                dismissible
                show={openModal}
                onClose={() => setOpenModal(false)}
                className="z-40 mt-10"
                size={"md"}
            >
                <Modal.Header>
                    {addOrupdate === "ADD" ? "THÊM BANNER" : "SỬA BANNER"}
                </Modal.Header>
                <Modal.Body>
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4 flex items-start">
                             
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        onChange={onChange}
                                        onPreview={onPreview}
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
                            </div>
                            <span className="block text-primary text-sm mb-5">{fileList.length <= 0 ? "Ảnh là bắt buộc *" : ""}</span>
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
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-primary text-white font-medium rounded-md hover:bg-primary"
                                >
                                    {addOrupdate === "ADD" ? "Thêm mới" : "Cập nhật"}
                                </button>
                            </div>
                        </form>
                    </LoadingOverlay>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default BannerList;
