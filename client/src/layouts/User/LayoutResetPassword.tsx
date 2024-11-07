import { Outlet } from "react-router-dom";

const LayoutResetPassword = () => {
  return (
    <section className="flex items-center justify-evenly mt-14">
      <div>
        <img
          src="../../../../src/assets/images/reset-password.svg"
          alt="reset-password"
        />
      </div>
      <Outlet />
    </section>
  );
};

export default LayoutResetPassword;
