import { Outlet } from "react-router-dom";
import SidebarUserDetails from "../../components/User/Header/SidebarUserDetails";

const LayoutUserDetails = () => {
  return (
    <>
      <h2 className="my-7 font-medium text-2xl text-primary">
        THÔNG TIN TÀI KHOẢN
      </h2>
      <div id="layou-userdetails" className="my-5 bg-white grid grid-cols-9 gap-5">
        <SidebarUserDetails />
        <div className="col-span-7">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default LayoutUserDetails;
