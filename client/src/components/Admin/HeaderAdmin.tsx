import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { MouseEvent, useState } from "react";
import Badge from "@mui/material/Badge";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";


const HeaderAdmin = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
                <Link to={"/admin"}>/ Bảng điều khiển</Link>
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
          <IconButton>
            <Badge badgeContent={1} color="warning">
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
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </Badge>
          </IconButton>
          <Button
            id="basic-button"
            onClick={handleClick}
            className="flex gap-3"
            color="inherit"
          >
            <Avatar
              alt="andinhle"
              src="../../../src/assets/images/profileH.jpg"
            />
            <span className="text-primary hidden md:block">Le Cong Hung</span>
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
              <MenuItem onClick={handleClose} className="flex gap-4">
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
                  Home
                </ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose} className="flex gap-4">
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
                  Profile
                </ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose} className="flex gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  className="MuiBox-root css-0 iconify iconify--material-symbols"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"
                  ></path>
                </svg>
                <ListItemText primaryTypographyProps={{ fontSize: 14 }}>
                  Setting
                </ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose} className="flex gap-4">
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
