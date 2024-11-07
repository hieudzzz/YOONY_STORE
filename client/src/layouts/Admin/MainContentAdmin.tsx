import { Outlet } from "react-router-dom";

const MainContentAdmin = () => {
  return (
    <main className="p-5">
      <Outlet />
    </main>
  );
};

export default MainContentAdmin;
