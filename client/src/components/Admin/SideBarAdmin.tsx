import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Logout from "../User/Auth/Logout";
import { IUser } from "../../interfaces/IUser";

const SideBarAdmin = () => {
  const [is_openProduct, setOpenProduct] = useState<boolean>(false);
  const [is_openStatis, setOpenStatis] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(null);
  useEffect(() => {
    if (location.pathname === "/admin") {
      setOpenProduct(false);
      setOpenStatis(false);
      setOpenStatis(false);
    } else if (location.pathname.startsWith("/admin/products")) {
      setOpenProduct(true);
    } else if (location.pathname.startsWith("/admin/thong-ke")) {
      setOpenStatis(true);
    }
  }, [location.pathname]);
  const handleLogout = () => {
    Logout();
    navigate("/");
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

  return (
    <>
      <nav className="fixed bg-util backdrop-blur top-0 max-w-[225px] left-0 bottom-0 w-full z-50 hidden lg:block transition-all shadow-sm">
        <div className="m-[25px]">
          <Link to={"/"}>
            <img
              src="../../../public/logo-web.svg"
              className="mx-auto block"
              alt="logo-website"
            />
          </Link>
        </div>
        <div className="flex flex-col justify-between min-h-[85vh]">
          <ul className="p-[20px] flex flex-col gap-3 text-hover nav-menu h-[71vh] overflow-auto menu-list-product-admin">
            {user?.role === "admin" && (
              <li>
                <NavLink
                  to={"/admin"}
                  className={
                    " rounded-md flex items-center gap-2 py-[10px] px-2 hover:bg-primary hover:text-util border border-[#f5f5f5] text-[15px] transition-all"
                  }
                  end
                  onClick={() => {
                    setOpenProduct(false);
                    setOpenStatis(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    color={"currentColor"}
                    fill={"none"}
                    className="size-5"
                  >
                    <path
                      d="M2.5 12C2.5 7.52167 2.5 5.2825 3.89124 3.89126C5.28249 2.50002 7.52166 2.50002 12 2.50002C16.4783 2.50002 18.7175 2.50002 20.1088 3.89126C21.5 5.2825 21.5 7.52167 21.5 12C21.5 16.4784 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4784 2.5 12Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M2.5 9.00002H21.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.99981 6.00002H7.00879"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.9998 6.00002H11.0088"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 17C17 14.2386 14.7614 12 12 12C9.23858 12 7 14.2386 7 17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12.707 15.293L11.2928 16.7072"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Bảng điều khiển
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to={"categorys"}
                className={
                  " rounded-md flex items-center gap-2 py-[10px] px-2 hover:bg-primary hover:text-util border border-[#f5f5f5] text-[15px] transition-all"
                }
                end
                onClick={() => {
                  setOpenProduct(false);
                  setOpenStatis(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"
                  />
                </svg>
                Danh mục
              </NavLink>
            </li>
            <li className={"space-y-2"}>
              <div
                className={`${
                  is_openProduct && "bg-secondary text-util hover:bg-secondary"
                } flex items-center justify-between px-2 py-[10px] rounded-md hover:cursor-pointer border border-[#f5f5f5] hover:bg-primary hover:text-util`}
                onClick={() => {
                  setOpenProduct(!is_openProduct);
                }}
              >
                <div className="flex gap-2 text-[15px]">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
                    />
                  </svg>
                  Sản phẩm
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`${
                    is_openProduct && "rotate-180 transition-all"
                  } size-5`}
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {is_openProduct && (
                <ul className="flex flex-col gap-2 bg-primary/15 rounded-md p-2">
                  <li className="">
                    <NavLink
                      to={"products/add"}
                      className={
                        "flex p-2 rounded-md gap-2 border bg-util border-[#f5f5f5] hover:bg-primary hover:text-util text-[15px] transition-all"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="size-5"
                        color={"currentColor"}
                        fill={"none"}
                      >
                        <path
                          d="M12 4V20"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 12H20"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Thêm sản phẩm
                    </NavLink>
                  </li>
                  <li className="">
                    <NavLink
                      to={"products"}
                      end
                      className={
                        "flex p-2 rounded-md gap-2 border bg-util border-[#f5f5f5] hover:bg-primary hover:text-util text-[15px] transition-all"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="size-5"
                        color={"currentColor"}
                        fill={"none"}
                      >
                        <path
                          d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11 7.5H17M8 7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5C7 7.22386 7.22386 7 7.5 7C7.77614 7 8 7.22386 8 7.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11 12H17M8 12C8 12.2761 7.77614 12.5 7.5 12.5C7.22386 12.5 7 12.2761 7 12C7 11.7239 7.22386 11.5 7.5 11.5C7.77614 11.5 8 11.7239 8 12Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11 16.5H17M8 16.5C8 16.7761 7.77614 17 7.5 17C7.22386 17 7 16.7761 7 16.5C7 16.2239 7.22386 16 7.5 16C7.77614 16 8 16.2239 8 16.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Danh sách
                    </NavLink>
                  </li>
                  <li className="">
                    <NavLink
                      to={"products/variants"}
                      end
                      className={
                        "flex p-2 rounded-md gap-2 border bg-util border-[#f5f5f5] hover:bg-primary hover:text-util text-[15px] transition-all"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="size-5"
                        color={"currentColor"}
                        fill={"none"}
                      >
                        <path
                          d="M21 21H10C6.70017 21 5.05025 21 4.02513 19.9749C3 18.9497 3 17.2998 3 14V3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M18 11H18.009"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 15H14.009"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 6H12.009"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 10H8.00898"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.5 19.5001L21 3.00012"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Biến thể
                    </NavLink>
                  </li>
                  {user?.role === "admin" && (
                    <>
                      <li className="">
                        <NavLink
                          to={"products/inventory"}
                          end
                          className={
                            "flex p-2 rounded-md gap-2 border bg-util border-[#f5f5f5] hover:bg-primary hover:text-util text-[15px] transition-all"
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-5"
                            color={"currentColor"}
                            fill={"none"}
                          >
                            <path
                              d="M11 22C10.1818 22 9.40019 21.6698 7.83693 21.0095C3.94564 19.3657 2 18.5438 2 17.1613C2 16.7742 2 10.0645 2 7M11 22L11 11.3548M11 22C11.7248 22 12.293 21.7409 13.5 21.2226M20 7V11"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15 17.5H22M18.5 21L18.5 14"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M7.32592 9.69138L4.40472 8.27785C2.80157 7.5021 2 7.11423 2 6.5C2 5.88577 2.80157 5.4979 4.40472 4.72215L7.32592 3.30862C9.12883 2.43621 10.0303 2 11 2C11.9697 2 12.8712 2.4362 14.6741 3.30862L17.5953 4.72215C19.1984 5.4979 20 5.88577 20 6.5C20 7.11423 19.1984 7.5021 17.5953 8.27785L14.6741 9.69138C12.8712 10.5638 11.9697 11 11 11C10.0303 11 9.12883 10.5638 7.32592 9.69138Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5 12L7 13"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16 4L6 9"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Nhập hàng hoá
                        </NavLink>
                      </li>
                      <li className="">
                        <NavLink
                          to={"products/suppliers"}
                          end
                          className={
                            "flex p-2 rounded-md gap-2 border bg-util border-[#f5f5f5] hover:bg-primary hover:text-util text-[15px] transition-all"
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-5"
                            color={"currentColor"}
                            fill={"none"}
                          >
                            <path
                              d="M12 22C11.1818 22 10.4002 21.6754 8.83693 21.0262C4.94564 19.4101 3 18.6021 3 17.2429V7.74463M12 22C12.8182 22 13.5998 21.6754 15.1631 21.0262C19.0544 19.4101 21 18.6021 21 17.2429V7.74463M12 22V12.1687M3 7.74463C3 8.3485 3.80157 8.72983 5.40472 9.49248L8.32592 10.8822C10.1288 11.7399 11.0303 12.1687 12 12.1687M3 7.74463C3 7.14076 3.80157 6.75944 5.40472 5.99678L7.5 5M21 7.74463C21 8.3485 20.1984 8.72983 18.5953 9.49248L15.6741 10.8822C13.8712 11.7399 12.9697 12.1687 12 12.1687M21 7.74463C21 7.14076 20.1984 6.75944 18.5953 5.99678L16.5 5M6 13.1518L8 14.135"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12.0037 2L12.0037 8.99995M12.0037 8.99995C12.2668 9.00351 12.5263 8.81972 12.7178 8.59534L14 7.06174M12.0037 8.99995C11.7499 8.99652 11.4929 8.81368 11.2897 8.59534L10 7.06174"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          Nhà cung cấp
                        </NavLink>
                      </li>
                      <li className="">
                        <NavLink
                          to={"products/historys"}
                          end
                          className={
                            "flex p-2 rounded-md gap-2 border bg-util border-[#f5f5f5] hover:bg-primary hover:text-util text-[15px] transition-all"
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-5"
                            color={"currentColor"}
                            fill={"none"}
                          >
                            <path
                              d="M12 22C6.47715 22 2.00004 17.5228 2.00004 12C2.00004 6.47715 6.47719 2 12 2C16.4777 2 20.2257 4.94289 21.5 9H19"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 8V12L14 14"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M21.9551 13C21.9848 12.6709 22 12.3373 22 12M15 22C15.3416 21.8876 15.6753 21.7564 16 21.6078M20.7906 17C20.9835 16.6284 21.1555 16.2433 21.305 15.8462M18.1925 20.2292C18.5369 19.9441 18.8631 19.6358 19.1688 19.3065"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="text-nowrap text-ellipsis overflow-hidden">
                            Lịch sử nhập hàng
                          </p>
                        </NavLink>
                      </li>
                    </>
                  )}
                </ul>
              )}
            </li>
            {user?.role === "admin" && (
              <li>
                <NavLink
                  to={"orders"}
                  className={
                    "flex items-center gap-2 py-[10px] px-2 hover:bg-primary hover:text-util border border-[#f5f5f5] text-[15px]  rounded-md transition-all"
                  }
                  onClick={() => {
                    setOpenProduct(false);
                    setOpenStatis(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                    />
                  </svg>
                  Đơn hàng
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to={"rates"}
                onClick={() => {
                  setOpenProduct(false);
                  setOpenStatis(false);
                }}
                className={
                  "flex items-center gap-2 py-[10px] px-2 rounded-md hover:bg-primary hover:text-util border border-[#f5f5f5] text-[15px] transition-all"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
                Đánh giá
              </NavLink>
            </li>
            {user?.role === "admin" && (
              <li>
                <NavLink
                  to={"users"}
                  end
                  onClick={() => {
                    setOpenProduct(false);
                    setOpenStatis(false);
                  }}
                  className={
                    "flex items-center gap-2 py-[10px] px-2 rounded-md hover:bg-primary hover:text-util border border-[#f5f5f5] text-[15px] transition-all"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-5"
                    color={"currentColor"}
                    fill={"none"}
                  >
                    <path
                      d="M11.5 14.0116C9.45338 13.9164 7.38334 14.4064 5.57757 15.4816C4.1628 16.324 0.453365 18.0441 2.71266 20.1966C3.81631 21.248 5.04549 22 6.59087 22H12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.5 6.5C15.5 8.98528 13.4853 11 11 11C8.51472 11 6.5 8.98528 6.5 6.5C6.5 4.01472 8.51472 2 11 2C13.4853 2 15.5 4.01472 15.5 6.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M18 20.7143V22M18 20.7143C16.8432 20.7143 15.8241 20.1461 15.2263 19.2833M18 20.7143C19.1568 20.7143 20.1759 20.1461 20.7737 19.2833M18 14.2857C19.1569 14.2857 20.1761 14.854 20.7738 15.7169M18 14.2857C16.8431 14.2857 15.8239 14.854 15.2262 15.7169M18 14.2857V13M22 14.9286L20.7738 15.7169M14.0004 20.0714L15.2263 19.2833M14 14.9286L15.2262 15.7169M21.9996 20.0714L20.7737 19.2833M20.7738 15.7169C21.1273 16.2271 21.3333 16.8403 21.3333 17.5C21.3333 18.1597 21.1272 18.773 20.7737 19.2833M15.2262 15.7169C14.8727 16.2271 14.6667 16.8403 14.6667 17.5C14.6667 18.1597 14.8728 18.773 15.2263 19.2833"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Người dùng
                </NavLink>
              </li>
            )}

            <li>
              <NavLink
                to={"banner"}
                onClick={() => {
                  setOpenProduct(false);
                  setOpenStatis(false);
                }}
                className={
                  "flex items-center gap-2 py-[10px] px-2 rounded-md hover:bg-primary hover:text-util border border-[#f5f5f5] text-[15px] transition-all"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-6"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M7.07523 3.88403C10.2874 4.8348 13.7126 4.8348 16.9248 3.88403C19.517 3.11677 20.813 2.73313 21.4065 3.20921C22 3.68529 22 4.90772 22 7.35256V16.6474C22 19.0923 22 20.3147 21.4065 20.7908C20.813 21.2669 19.5169 20.8832 16.9248 20.116C13.7126 19.1652 10.2874 19.1652 7.07523 20.116C4.48305 20.8832 3.18696 21.2669 2.59348 20.7908C2 20.3147 2 19.0923 2 16.6474V7.35256C2 4.90772 2 3.68529 2.59348 3.20921C3.18696 2.73313 4.48305 3.11677 7.07523 3.88403Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7 20C10.9469 15.8426 15.3824 10.3291 22 14.4643"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M9 8.5C9 9.32843 8.32843 10 7.5 10C6.67157 10 6 9.32843 6 8.5C6 7.67157 6.67157 7 7.5 7C8.32843 7 9 7.67157 9 8.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Banner
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"vouchers"}
                onClick={() => {
                  setOpenProduct(false);
                  setOpenStatis(false);
                }}
                className={
                  "flex items-center gap-2 py-[10px] px-2 rounded-md hover:bg-primary border border-[#f5f5f5] hover:text-util text-[15px] transition-all"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                  />
                </svg>
                Mã giảm giá
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"blogs"}
                onClick={() => {
                  setOpenProduct(false);
                  setOpenStatis(false);
                }}
                className={
                  "flex items-center gap-2 py-[10px] px-2 rounded-md hover:bg-primary hover:text-util border border-[#f5f5f5] text-[15px] transition-all"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  />
                </svg>
                Bài viết
              </NavLink>
            </li>
            {user?.role === "admin" && (
              <li className={"space-y-2"}>
                <div
                  className={`${
                    is_openStatis && "bg-secondary text-util hover:bg-secondary"
                  } flex items-center justify-between px-2 py-[10px] rounded-md hover:cursor-pointer border border-[#f5f5f5] hover:bg-primary hover:text-util`}
                  onClick={() => {
                    setOpenStatis(!is_openStatis);
                  }}
                >
                  <div className="flex gap-2 text-[15px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-6"
                      color={"currentColor"}
                      fill={"none"}
                    >
                      <path
                        d="M21 21H10C6.70017 21 5.05025 21 4.02513 19.9749C3 18.9497 3 17.2998 3 14V3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M17.7048 9.33333L14.8311 13.9845C14.4123 14.6623 13.9369 15.686 13.0749 15.5344C12.0611 15.356 11.5742 13.8449 10.7026 13.3445C9.99285 12.9371 9.47971 13.4281 9.06475 14M21 4L19.1465 7M5 20L7.52632 16.2667"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Thống kê
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={`${
                      is_openStatis && "rotate-180 transition-all"
                    } size-5`}
                    color={"currentColor"}
                    fill={"none"}
                  >
                    <path
                      d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {is_openStatis && (
                  <ul className="flex flex-col gap-2 bg-primary/15 rounded-md p-2">
                    <li className="">
                      <NavLink
                        to={"thong-ke/san-pham"}
                        className={
                          "flex p-2 rounded-md gap-2 border bg-util border-[#f5f5f5] hover:bg-primary hover:text-util text-[15px] transition-all"
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="size-5"
                          color={"currentColor"}
                          fill={"none"}
                        >
                          <path
                            d="M5.94724 9.003C5.94724 9.003 3.68265 11.252 3.01654 10.9766C2.07687 10.5882 1.67051 6.8204 2.30951 6.24512L4.76679 4.03287C5.90144 3.01137 5.93084 3 7.43853 3H8.95703C9.1835 4.3592 10.4956 5.99207 12 5.99207C13.5044 5.99207 14.8165 4.3592 15.043 3H16.5615C18.0692 3 18.0986 3.01136 19.2332 4.03287L21.6905 6.24512C22.3295 6.8204 21.9231 10.5882 20.9835 10.9766C20.3173 11.252 18.0489 9.003 18.0489 9.003"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6 8V18.5267C6 19.2323 6.11985 19.6092 6.75491 19.9496C9.3676 21.3501 14.6324 21.3501 17.2451 19.9496C17.8802 19.6092 18 19.2323 18 18.5267L18 8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6 10C8 12.6667 16 12.6667 18 10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Sản phẩm
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
          <div className="px-[20px] text-primary mb-7 btn-logout">
            <button
              onClick={handleLogout}
              className="py-[10px] bg-primary/20 px-2 w-full flex items-center gap-2 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#FF9900"
                className="size-5 inline hover:text-util"
              >
                <path d="M5 11H13V13H5V16L0 12L5 8V11ZM3.99927 18H6.70835C8.11862 19.2447 9.97111 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.97111 4 8.11862 4.75527 6.70835 6H3.99927C5.82368 3.57111 8.72836 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C8.72836 22 5.82368 20.4289 3.99927 18Z"></path>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};
export default SideBarAdmin;
