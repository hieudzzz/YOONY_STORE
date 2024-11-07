import {
  Avatar,
  Badge,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import { MouseEvent, useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartContext from "../../../contexts/CartContext";
import { Popover } from "antd";
import ShowMiniCart from "../Show/ShowMiniCart";
import { useAuth } from "../../../providers/AuthProvider";
import ChatModal from "./ChatModal";
import ShowNotificationUser from "../Show/ShowNotificationUser";
import { Divider } from 'antd';
const NavMenuUser = () => {
  const [chatVisible, setChatVisible] = useState(false); // State cho chat modal
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { carts } = useContext(CartContext);
  const { user, logout } = useAuth();
  const navigate=useNavigate()
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/')
  };
  const toggleChat = () => {
    setChatVisible(!chatVisible); // Chuyển đổi trạng thái của chat modal
  };

  const userButton = useMemo(
    () => (
      <button
        className="flex gap-2 items-center py-2 px-3.5 rounded-md hover:bg-primary hover:text-util transition-all"
        id="btn-account"
        onClick={handleClick}
      >
        {!user ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#ff9900"
              className="size-6 fill-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <span>Tài khoản</span>
          </>
        ) : (
          <div className="max-w-[125px] flex gap-2">
            <Avatar
              alt={String(user?.name).toUpperCase()}
              src={user?.avatar || "/default-avatar.png"}
              sx={{ width: 24, height: 24 }}
            />
            <p className="overflow-hidden text-ellipsis whitespace-nowrap">{user?.name}</p>
          </div>
        )}
      </button>
    ),
    [user]
  );

  return (
    <nav className="hidden lg:block">
      <ul className="flex items-center gap-3">
        <li>
          <Link
            to="/checkorder"
            className="flex gap-2 items-center py-2 px-3.5 rounded-md  hover:bg-primary hover:text-util transition-all"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.86066 22.17C10.5207 22.54 11.3907 22.75 12.3007 22.75C13.2107 22.75 14.0807 22.54 14.7407 22.16C15.1007 21.96 15.2307 21.5 15.0307 21.14C14.8307 20.78 14.3707 20.65 14.0107 20.85C13.7482 20.9978 13.4139 21.101 13.0508 21.1596V12.991L21.0358 8.36572C21.1161 8.63829 21.1606 8.90804 21.1606 9.15997V12.82C21.1606 13.23 21.5006 13.57 21.9106 13.57C22.3206 13.57 22.6606 13.23 22.6606 12.82V9.15997C22.6606 7.49997 21.5206 5.57001 20.0706 4.77001L14.7307 1.80999C13.3607 1.04999 11.2207 1.04999 9.86066 1.80999L4.52066 4.77001C3.07066 5.58001 1.93066 7.49997 1.93066 9.15997V14.82C1.93066 16.48 3.07066 18.41 4.52066 19.21L9.86066 22.17ZM20.3561 7.01894L12.3006 11.6796L4.25189 7.02183C4.54363 6.62759 4.89279 6.29481 5.26065 6.09002L10.6006 3.13C11.5106 2.62 13.1007 2.62 14.0107 3.13L19.3506 6.09002C19.7152 6.29127 20.0638 6.62372 20.3561 7.01894ZM3.57364 8.36918L11.5508 12.9856V21.157C11.1926 21.098 10.8622 20.9956 10.6006 20.85L5.26065 17.89C4.30065 17.36 3.45065 15.92 3.45065 14.82V9.15997C3.45065 8.90874 3.49447 8.6403 3.57364 8.36918ZM19.5008 22.1498C17.3208 22.1498 15.5508 20.3798 15.5508 18.1998C15.5508 16.0198 17.3208 14.2498 19.5008 14.2498C21.6808 14.2498 23.4508 16.0198 23.4508 18.1998C23.4508 19.0209 23.1997 19.7838 22.7701 20.4159C22.7911 20.4327 22.8113 20.4508 22.8307 20.4702L23.8307 21.4702C24.1207 21.7602 24.1207 22.2402 23.8307 22.5302C23.6807 22.6802 23.4907 22.7502 23.3007 22.7502C23.1107 22.7502 22.9207 22.6802 22.7707 22.5302L21.7707 21.5302C21.7513 21.5108 21.7332 21.4905 21.7164 21.4695C21.0844 21.8988 20.3216 22.1498 19.5008 22.1498ZM19.5008 15.7498C18.1508 15.7498 17.0508 16.8498 17.0508 18.1998C17.0508 19.5498 18.1508 20.6498 19.5008 20.6498C20.8508 20.6498 21.9508 19.5498 21.9508 18.1998C21.9508 16.8498 20.8508 15.7498 19.5008 15.7498Z"
                fill="#ff9900"
                className="fill-icon-check-order transition-all"
              ></path>
            </svg>
            Check Order
          </Link>
        </li>
        <li>
          <Popover
            placement="bottomRight"
            title={"Sản phẩm mới thêm"}
            content={<ShowMiniCart />}
          >
            <Link
              to={`/gio-hang`}
              className="flex gap-2 items-center py-2 px-3.5 rounded-md  hover:bg-primary hover:text-util transtition-all"
            >
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#ff9900"
                  className="size-6 fill-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>

                <span className="px-[4px] absolute -top-1 -right-1 bg-primary text-xs text-util rounded-full number-cart">
                  {carts && carts.length >= 1 ? carts.length : 0}
                </span>
              </div>
              Giỏ hàng
            </Link>
          </Popover>
        </li>
        {user && (
          <li>
            <Popover
              placement="bottomRight"
              title={"Thông báo mói nhận"}
              content={<ShowNotificationUser />}
            >
              <Link
                to={`/thong-bao`}
                className="flex gap-2 items-center rounded-md hover:text-util transtition-all"
              >
                <IconButton>
                  <Badge badgeContent={1} color="warning">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#ff9900"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                      />
                    </svg>
                  </Badge>
                </IconButton>
              </Link>
            </Popover>
          </li>
        )}
        <li>
          <button
            onClick={toggleChat}
            className="flex gap-2 items-center py-2 px-4 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 fill-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
            Hỗ trợ
          </button>
        </li>
        <li>
          {userButton}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            MenuListProps={{
              "aria-labelledby": "btn-account",
            }}
          >
            {!user ? (
              <MenuList sx={{ width: 135, maxWidth: "100%", padding: 0 }}>
                <Link to={"/auth/register"}>
                  <MenuItem
                    onClick={handleClose}
                    className=" hover:!text-primary transition-all py-2 flex items-center gap-2"
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
                        d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                      />
                    </svg>
                    <ListItemText
                      primaryTypographyProps={{ fontSize: 14, padding: 0.5 }}
                    >
                      Đăng kí
                    </ListItemText>
                  </MenuItem>
                </Link>
                <Link to={"/auth/login"}>
                  <MenuItem
                    onClick={handleClose}
                    className=" hover:!text-primary transition-all flex items-center gap-2"
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
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                      />
                    </svg>
                    <ListItemText
                      primaryTypographyProps={{ fontSize: 14, padding: 0.5 }}
                    >
                      Đăng nhập
                    </ListItemText>
                  </MenuItem>
                </Link>
              </MenuList>
            ) : (
              <MenuList sx={{ width: "100%", maxWidth: "100%", padding: 0 }}>
                <Link to={"/user-manager"}>
                  <MenuItem
                    onClick={handleClose}
                    className=" hover:!text-primary transition-all py-2 flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-5"
                      color={"currentColor"}
                      fill={"none"}
                    >
                      <path
                        d="M14 8.99988H18"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M14 12.4999H17"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <rect
                        x="2"
                        y="2.99988"
                        width="20"
                        height="18"
                        rx="5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 15.9999C6.20831 13.4188 10.7122 13.249 12 15.9999"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.5 8.99988C10.5 10.1044 9.60457 10.9999 8.5 10.9999C7.39543 10.9999 6.5 10.1044 6.5 8.99988C6.5 7.89531 7.39543 6.99988 8.5 6.99988C9.60457 6.99988 10.5 7.89531 10.5 8.99988Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <ListItemText
                      primaryTypographyProps={{ fontSize: 14, padding: 0.5 }}
                    >
                      Thông tin tài khoản
                    </ListItemText>
                  </MenuItem>
                </Link>
                <Divider style={{margin:7}} dashed />
                <MenuItem className="flex flex-col transition-all gap-2 hover:!text-primary">
                  <div
                    className="flex items-center gap-2 w-full"
                    onClick={handleLogout}
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
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                      />
                    </svg>
                    <ListItemText
                      primaryTypographyProps={{ fontSize: 14, padding: 0.5 }}
                    >
                      Đăng xuất
                    </ListItemText>
                  </div>
                </MenuItem>
              </MenuList>
            )}
          </Menu>
        </li>
      </ul>
      <ChatModal visible={chatVisible} onClose={toggleChat} />{" "}
      {/* Hiển thị modal chat */}
    </nav>
  );
};
export default NavMenuUser;
