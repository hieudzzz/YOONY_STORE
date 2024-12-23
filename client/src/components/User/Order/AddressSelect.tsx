import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { useContext, useEffect, useState } from "react";
import { AddressContext } from "../../../contexts/AddressContext";
import ModalAddress from "../Manager/Addresses/ModalAddress";
import instance from "../../../instance/instance";
import { message, Popconfirm } from "antd";

const AddressSelect = ({ onAddressSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addresses, dispatch } = useContext(AddressContext);
  const [addOrUpdate, setAddOrUpdate] = useState<string>("ADD");
  const [idAddress, setIdAddress] = useState<number>();
  const [user, setUser] = useState(null);
  const userData = (() => {
    try {
      const data = localStorage.getItem("userInfor");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error parsing userInfor:", error);
      return null;
    }
  })();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const [addressOrder, setAddressOrder] = useState<number | undefined>();

  useEffect(() => {
    onAddressSelect(addressOrder || null);
  }, [addressOrder, onAddressSelect]);
  const handleCancel = () => {
    setIsModalOpen(false);
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

  useEffect(() => {
    try {
      if (userData?.address_id) {
        setAddressOrder(userData.address_id);
        localStorage.setItem('addressSelect',JSON.stringify(userData?.address_id))
      }
      const dataLocalAddress=localStorage.getItem('addressSelect')
      const addressSelect = JSON.parse(dataLocalAddress!);
      if (addressSelect) {
        setAddressOrder(addressSelect);
      } else if (userData?.address_id) {
        setAddressOrder(userData.address_id);
      }
    } catch (error) {
      console.error("Error parsing addressSelect:", error);
    }
  }, [userData?.address_id]);

  const getIdAddress = (id: number) => {
    setIdAddress(id);
    setAddOrUpdate("UPDATE");
    setIsModalOpen(true);
  };
  const handleRemoveAddress = async (id: number) => {
    try {
      const data = await instance.delete(`delete-address/${id}`);
      if (data) {
        dispatch({
          type: "DELETE",
          payload: id,
        });
        message.success("Xoá địa chỉ thành công !");
        window.dispatchEvent(new Event("auth-change"));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const checkSelectAddress = (idAddress: number) => {
    setAddressOrder(idAddress);
    localStorage.setItem('addressSelect',JSON.stringify(idAddress))
  };
  const handleSettingDefaultAddress = async (id: number) => {
    try {
      const { data } = await instance.patch(`update-default-address/${id}`);
      if (data) {
        userData.address_id = data?.default_address_id;
        localStorage.setItem("userInfor", JSON.stringify(userData));
        message.success('Đã thiết lập địa chỉ mặc định')
        window.dispatchEvent(new Event("auth-change"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h3 className="font-medium">Chọn địa chỉ nhận hàng</h3>
        <p className="text-sm text-secondary/55">
          Hãy thêm địa chỉ nhận hàng để chúng tôi có thể giao tận tay bạn{" "}
          <button className="text-primary" onClick={showModal}>
            ( Chưa có địa chỉ hãy thêm ngay )
          </button>
        </p>
      </div>
      <div>
        {addresses.length === 0 ? (
          <div className="border border-primary border-dashed w-fit text-primary rounded-md">
            <button
              className="flex gap-1 items-center py-5 px-6"
              onClick={showModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-5"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M18 18C19.2447 18.4244 20 18.9819 20 19.5925C20 20.9221 16.4183 22 12 22C7.58172 22 4 20.9221 4 19.5925C4 18.9819 4.75527 18.4244 6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M15 9.5C15 11.1569 13.6569 12.5 12 12.5C10.3431 12.5 9 11.1569 9 9.5C9 7.84315 10.3431 6.5 12 6.5C13.6569 6.5 15 7.84315 15 9.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 2C16.0588 2 19.5 5.42803 19.5 9.5869C19.5 13.812 16.0028 16.777 12.7725 18.7932C12.5371 18.9287 12.2709 19 12 19C11.7291 19 11.4629 18.9287 11.2275 18.7932C8.00325 16.7573 4.5 13.8266 4.5 9.5869C4.5 5.42803 7.9412 2 12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Thêm địa chỉ mới
            </button>
          </div>
        ) : (
          <Swiper
            slidesPerView={3}
            spaceBetween={10}
            freeMode={true}
            modules={[FreeMode]}
            className="mySwiper my-5 flex flex-wrap gap-[25px] hover:cursor-pointer"
          >
            {addresses
            ?.sort((a, b) =>
              a.id === user?.address_id ? -1 : b.id === user?.address_id ? 1 : 0
            )
            ?.map((address) => {
              return (
                <SwiperSlide className="pb-1 px-0.5 space-y-5" key={address.id}>
                  <div className="w-full space-x-2.5 bg-util p-3 border border-[#f1f1f1f1] rounded-md flex justify-between">
                    <div className="space-y-2.5">
                      <h5 className="flex gap-2 items-center">
                        <span className="font-medium text-sm">
                          {address.fullname}
                        </span>
                        <span className="border-r border-[#eaeaea] h-5"></span>
                        <span className="text-sm text-secondary/50 flex items-center gap-1.5 tracking-wider">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-4"
                            color="currentColor"
                            fill={"none"}
                          >
                            <path
                              d="M13 3C17.4183 3 21 6.58172 21 11M13.5 6.5C15.7091 6.5 17.5 8.29086 17.5 10.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M9.15825 5.71223L8.7556 4.80625C8.49232 4.21388 8.36068 3.91768 8.1638 3.69101C7.91707 3.40694 7.59547 3.19794 7.23567 3.08785C6.94858 3 6.62446 3 5.97621 3C5.02791 3 4.55375 3 4.15573 3.18229C3.68687 3.39702 3.26343 3.86328 3.09473 4.3506C2.95151 4.76429 2.99253 5.18943 3.07458 6.0397C3.94791 15.0902 8.90981 20.0521 17.9603 20.9254C18.8106 21.0075 19.2357 21.0485 19.6494 20.9053C20.1367 20.7366 20.603 20.3131 20.8177 19.8443C21 19.4462 21 18.9721 21 18.0238C21 17.3755 21 17.0514 20.9122 16.7643C20.8021 16.4045 20.5931 16.0829 20.309 15.8362C20.0823 15.6393 19.7861 15.5077 19.1937 15.2444L18.2878 14.8417C17.6462 14.5566 17.3255 14.4141 16.9995 14.3831C16.6876 14.3534 16.3731 14.3972 16.0811 14.5109C15.776 14.6297 15.5063 14.8544 14.967 15.3038C14.4301 15.7512 14.1617 15.9749 13.8337 16.0947C13.543 16.2009 13.1586 16.2403 12.8523 16.1951C12.5069 16.1442 12.2423 16.0029 11.7133 15.7201C10.0672 14.8405 9.15953 13.9328 8.27986 12.2867C7.99714 11.7577 7.85578 11.4931 7.80487 11.1477C7.75974 10.8414 7.79908 10.457 7.9053 10.1663C8.02512 9.83828 8.24881 9.56986 8.69619 9.033C9.14562 8.49368 9.37034 8.22402 9.48915 7.91891C9.60285 7.62694 9.64661 7.3124 9.61694 7.00048C9.58594 6.67452 9.44338 6.35376 9.15825 5.71223Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          {address.phone}
                        </span>
                      </h5>
                      <div className="text-sm text-secondary/75 space-y-1">
                        <p className="line-clamp-1">{address.address}</p>
                        <p className="line-clamp-1">
                          {address.ward}, {address.district}, {address.province}
                        </p>
                      </div>
                      <div className="space-y-4 pt-2">
                        <div className="flex text-sm gap-3">
                          <button
                            className="bg-[#34c759]/10 text-[#27b84b] w-full py-1.5 rounded-sm"
                            onClick={() => getIdAddress(address.id!)}
                          >
                            Cập nhật
                          </button>
                          <Popconfirm
                            title="Xoá địa chỉ ?"
                            description="Sẽ không thể khôi phục."
                            okText="Xoá"
                            cancelText="Trở lại"
                            onConfirm={() => {
                              handleRemoveAddress(address.id!);
                            }}
                            placement="topRight"
                          >
                            <button
                              className={`bg-primary/10 text-primary w-full py-1.5 rounded-sm ${
                                address.id === userData?.address_id
                                  ? "hover:cursor-not-allowed bg-secondary/5 text-secondary/40"
                                  : ""
                              }`}
                              disabled={address.id === userData?.address_id}
                            >
                              Xoá
                            </button>
                          </Popconfirm>
                          <button
                            onClick={() =>
                              handleSettingDefaultAddress(address.id!)
                            }
                            disabled={address.id === user?.address_id}
                            className={`
                                ${address.id === user?.address_id ?'text-primary hover:cursor-not-allowed':'text-secondary/55'}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="size-6"
                              color={"currentColor"}
                              fill={`${address.id === user?.address_id ?'currentColor':'none'}`}
                            >
                              <path
                                d="M4 17.9808V9.70753C4 6.07416 4 4.25748 5.17157 3.12874C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.12874C20 4.25748 20 6.07416 20 9.70753V17.9808C20 20.2867 20 21.4396 19.2272 21.8523C17.7305 22.6514 14.9232 19.9852 13.59 19.1824C12.8168 18.7168 12.4302 18.484 12 18.484C11.5698 18.484 11.1832 18.7168 10.41 19.1824C9.0768 19.9852 6.26947 22.6514 4.77285 21.8523C4 21.4396 4 20.2867 4 17.9808Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() => checkSelectAddress(address.id!)}
                      className={`${
                        addressOrder === address.id
                          ? "bg-primary border-none"
                          : "bg-util border"
                      } min-w-5 h-5 shadow-inner rounded-sm cursor-pointer`}
                    >
                      {addressOrder === address.id && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="size-5"
                          color={"#ffffff"}
                          fill={"none"}
                        >
                          <path
                            d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
      <ModalAddress
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        setIsModalOpen={setIsModalOpen}
        idAddress={idAddress!}
        addOrUpdate={addOrUpdate!}
        setAddOrUpdate={setAddOrUpdate}
      />
    </div>
  );
};

export default AddressSelect;
