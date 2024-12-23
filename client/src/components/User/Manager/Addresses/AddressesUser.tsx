import { useContext, useEffect, useState } from "react";
import ModalAddress from "./ModalAddress";
import { AddressContext } from "../../../../contexts/AddressContext";
import instance from "../../../../instance/instance";
import { message, Popconfirm } from "antd";

const AddressesUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addresses, dispatch } = useContext(AddressContext);
  const [addOrUpdate, setAddOrUpdate] = useState<string>("ADD");
  const [idAddress, setIdAddress] = useState<number>();
  const [user, setUser] = useState(null);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
      }
      console.log(data);
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

  const getIdAddress = (id: number) => {
    setIdAddress(id);
    setAddOrUpdate("UPDATE");
    setIsModalOpen(true);
  };
  const handleSettingDefaultAddress = async (id: number) => {
    try {
      const { data } = await instance.patch(`update-default-address/${id}`);
      if (data) {
        const userData = JSON.parse(localStorage.getItem("userInfor")!);
        userData.address_id = data?.default_address_id;
        localStorage.setItem("userInfor", JSON.stringify(userData));
        message.success("Đã thiết lập địa chỉ mặc định");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-util border border-[#f1f1f1] p-5 rounded-md min-h-screen space-y-4">
      <div className="flex justify-between items-center border-b border-[#f1f1f1] pb-5">
        <h2 className="uppercase font-medium text-base">Địa chỉ của tôi</h2>
        <button
          onClick={showModal}
          className="flex items-center gap-1 text-white py-1.5 px-3.5 bg-primary hover:bg-transparent hover:outline-primary hover:outline-1 hover:outline hover:text-primary transition-all rounded-sm text-sm"
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
          Thêm địa chỉ mới
        </button>
      </div>
      <ModalAddress
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        setIsModalOpen={setIsModalOpen}
        idAddress={idAddress!}
        addOrUpdate={addOrUpdate!}
        setAddOrUpdate={setAddOrUpdate}
      />
      <div className="overflow-y-auto max-h-screen space-y-4 pr-1 address-scroll">
        {addresses?.length === 0 ? (
          <div className="flex flex-col items-center text-secondary/20 space-y-2 justify-center min-h-[50vh]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-16"
              viewBox="0 0 64 41"
            >
              <g fill="none" fillRule="evenodd" transform="translate(0 1)">
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
            <p>Không có địa chỉ</p>
          </div>
        ) : (
          addresses
            ?.sort((a, b) =>
              a.id === user?.address_id ? -1 : b.id === user?.address_id ? 1 : 0
            )
            ?.map((address) => {
              return (
                <div
                  className="flex justify-between border border-[#f1f1f1] p-3 rounded-md"
                  key={address.id}
                >
                  <div className="max-w-[60%] w-full space-y-2.5">
                    <h5 className="flex gap-2 items-center">
                      <span className="font-medium">{address.fullname}</span>
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
                    <div className="flex gap-2">
                      {address.id === user?.address_id && (
                        <p className="text-primary text-sm border border-primary w-fit px-1.5">
                          Mặc định
                        </p>
                      )}
                      <p className="text-secondary/40 text-sm border border-[#eaeaea] w-fit px-1.5">
                        Địa chỉ nhận hàng
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex text-sm gap-3 justify-end">
                      <button
                        className="bg-[#34c759]/10 text-[#25c04c] px-3 py-1.5 rounded-sm"
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
                          className={`bg-primary/10 text-primary px-3 py-1.5 rounded-sm ${
                            address.id === user?.address_id
                              ? "hover:cursor-not-allowed bg-secondary/5 text-secondary/40"
                              : ""
                          }`}
                          disabled={address.id === user?.address_id}
                        >
                          Xoá
                        </button>
                      </Popconfirm>
                    </div>
                    <div>
                      <button
                        onClick={() => handleSettingDefaultAddress(address.id!)}
                        className={`py-1.5 px-3.5 border border-[#f1f1f1] text-sm ${
                          address.id === user?.address_id
                            ? "hover:cursor-not-allowed bg-secondary/5 text-secondary/40"
                            : "hover:border-primary/75 hover:text-primary transition-all  rounded-sm text-secondary/65"
                        }`}
                        disabled={address.id === user?.address_id}
                      >
                        Thiết lập mặc định
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default AddressesUser;
