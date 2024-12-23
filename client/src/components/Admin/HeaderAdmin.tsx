import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { MouseEvent, useEffect, useState } from "react";
import Badge from "@mui/material/Badge";
import { IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Logout from "../User/Auth/Logout";

const HeaderAdmin = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    setAnchorEl(null);
    Logout();
    navigate("/");
  };
  const userData = JSON.parse(localStorage.getItem("userInfor") || "{}");
  return (
    <div className="sticky top-0 bg-white py-[10px] px-[15px] lg:px-[30px backdrop-blur z-50 shadow-sm">
      <header className="flex justify-between items-center ">
        <div className="bars cursor-pointer block lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </div>
        <div className="hidden lg:block">
          <nav>
            <ul className="flex gap-2">
              <li>
                <Link to={"admin"}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#FF9900"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link to={"/admin"}>Trang quản trị</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="max-w-[100px] block lg:hidden">
          <img
            src="../../../public/logo-web.svg"
            className="w-full"
            alt="logo-website-admin"
          />
        </div>
        <div className="space-x-5">
          <Button
            id="basic-button"
            onClick={handleClick}
            className="flex gap-3"
            color="inherit"
          >
            <Avatar alt="andinhle" src={userData.avatar} />
            <span className="text-primary hidden md:block">
              {userData.name}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#FF9900"
              className="size-5 hidden md:block"
            >
              <path d="M12 16L6 10H18L12 16Z"></path>
            </svg>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuList sx={{ width: 175, maxWidth: "100%", padding: 0 }}>
              <MenuItem onClick={() => navigate("/")} className="flex gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  className="MuiBox-root css-0 iconify iconify--ion"
                  width="1em"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M416 174.74V48h-80v58.45L256 32L0 272h64v208h144V320h96v160h144V272h64z"
                  ></path>
                </svg>
                <ListItemText primaryTypographyProps={{ fontSize: 14 }}>
                  Trang chủ
                </ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => navigate("/user-manager")}
                className="flex gap-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  className="MuiBox-root css-0 iconify iconify--mdi"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m0 7c2.67 0 8 1.33 8 4v3H4v-3c0-2.67 5.33-4 8-4m0 1.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1"
                  ></path>
                </svg>
                <ListItemText primaryTypographyProps={{ fontSize: 14 }}>
                  Thông tin tài khoản
                </ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} className="flex gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#FF9900"
                  className="size-4 inline"
                >
                  <path d="M5 11H13V13H5V16L0 12L5 8V11ZM3.99927 18H6.70835C8.11862 19.2447 9.97111 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.97111 4 8.11862 4.75527 6.70835 6H3.99927C5.82368 3.57111 8.72836 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C8.72836 22 5.82368 20.4289 3.99927 18Z"></path>
                </svg>{" "}
                <ListItemText
                  className="text-primary"
                  primaryTypographyProps={{ fontSize: 14 }}
                >
                  Logout
                </ListItemText>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </header>
    </div>
  );
};

export default HeaderAdmin;
