import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const SidebarUserDetails = () => {
  const [user, setUser] = useState(null);
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
    <div className="col-span-3 lg:col-span-2 min-h-screen bg-util border border-[#f1f1f1] rounded-md">
      <div className="flex items-center p-4 border-b border-[#f1f1f1]">
        <Avatar
          alt={String(user?.name).toUpperCase()}
          src={user?.avatar || "/default-avatar.png"}
          sx={{ width: 50, height: 50 }}
        />
        <div className="ml-3">
          <h4 className="font-medium line-clamp-2">{user?.name}</h4>
          <p className="text-sm text-primary italic">( Member )</p>
        </div>
      </div>
      <nav className="mt-4">
        <ul>
          <li className="mb-2">
            <NavLink
              to="/user-manager"
              end
              className={`flex items-center px-3 py-2.5 cursor-pointer border m-4 rounded-sm hover:bg-[#fafafe] hover:text-hover transition-all border-[#f1f1f1]`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <span>Tài khoản</span>
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="user-orders"
              className={`flex items-center px-3 py-2.5 cursor-pointer border m-4 rounded-sm hover:bg-[#fafafe] hover:text-hover transition-all border-[#f1f1f1] `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <span>Đơn hàng</span>
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="user-ratings"
              className={`flex items-center px-3 py-2.5 cursor-pointer border m-4 rounded-sm hover:bg-[#fafafe] hover:text-hover transition-all border-[#f1f1f1] gap-2 
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-6"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M2 12C2 7.52166 2 5.28249 3.39124 3.89124C4.78249 2.5 7.02166 2.5 11.5 2.5C15.9783 2.5 18.2175 2.5 19.6088 3.89124C21 5.28249 21 7.52166 21 12C21 16.4783 21 18.7175 19.6088 20.1088C18.2175 21.5 15.9783 21.5 11.5 21.5C7.02166 21.5 4.78249 21.5 3.39124 20.1088C2 18.7175 2 16.4783 2 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.3638 7.72209L13.2437 9.49644C13.3637 9.74344 13.6837 9.98035 13.9536 10.0257L15.5485 10.2929C16.5684 10.4643 16.8083 11.2103 16.0734 11.9462L14.8335 13.1964C14.6236 13.4081 14.5086 13.8164 14.5736 14.1087L14.9285 15.6562C15.2085 16.8812 14.5636 17.355 13.4887 16.7148L11.9939 15.8226C11.7239 15.6613 11.2789 15.6613 11.004 15.8226L9.50913 16.7148C8.43925 17.355 7.78932 16.8761 8.06929 15.6562L8.42425 14.1087C8.48925 13.8164 8.37426 13.4081 8.16428 13.1964L6.92442 11.9462C6.1945 11.2103 6.42947 10.4643 7.44936 10.2929L9.04419 10.0257C9.30916 9.98035 9.62912 9.74344 9.74911 9.49644L10.629 7.72209C11.109 6.7593 11.8889 6.7593 12.3638 7.72209Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Đánh giá</span>
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="wishlist"
              className={`flex items-center px-3 py-2.5 cursor-pointer border m-4 rounded-sm hover:bg-[#fafafe] hover:text-hover transition-all border-[#f1f1f1]`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              <span>Yêu thích</span>
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="addresses"
              className={`flex items-center px-3 py-2.5 cursor-pointer border m-4 rounded-sm hover:bg-[#fafafe] hover:text-hover transition-all border-[#f1f1f1] 
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <span>Địa chỉ</span>
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="thong-bao"
              className={`flex items-center px-3 py-2.5 cursor-pointer border m-4 rounded-sm hover:bg-[#fafafe] hover:text-hover transition-all border-[#f1f1f1]`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-6 mr-2"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M2.52992 14.7696C2.31727 16.1636 3.268 17.1312 4.43205 17.6134C8.89481 19.4622 15.1052 19.4622 19.5679 17.6134C20.732 17.1312 21.6827 16.1636 21.4701 14.7696C21.3394 13.9129 20.6932 13.1995 20.2144 12.5029C19.5873 11.5793 19.525 10.5718 19.5249 9.5C19.5249 5.35786 16.1559 2 12 2C7.84413 2 4.47513 5.35786 4.47513 9.5C4.47503 10.5718 4.41272 11.5793 3.78561 12.5029C3.30684 13.1995 2.66061 13.9129 2.52992 14.7696Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 19C8.45849 20.7252 10.0755 22 12 22C13.9245 22 15.5415 20.7252 16 19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Thông báo</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarUserDetails;
