import { Outlet } from "react-router-dom";
import ProductProvider from "../../providers/ProductProvider";

const LayoutStatisAdmin = () => {
  return (
    <ProductProvider>
      <div>
        <Outlet />
      </div>
    </ProductProvider>
  );
};

export default LayoutStatisAdmin;
