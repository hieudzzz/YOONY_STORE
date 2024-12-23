import { Outlet } from "react-router-dom";
import ProductProvider from "../../providers/ProductProvider";
import AttributeProvider from "../../providers/AttributeProvider";
import AttributeValueProvider from "../../providers/AttributeValueProvider";
import InventoryProvider from "../../providers/InventoryProvider";
import SupplierProvider from "../../providers/SupplierProvider";
import TrashProvider from "../../providers/TrashProvider";

const LayoutProductAdmin = () => {
  return (
      <ProductProvider>
        <AttributeValueProvider>
          <AttributeProvider>
            <InventoryProvider>
              <SupplierProvider>
                <TrashProvider>
                  <Outlet />
                </TrashProvider>
              </SupplierProvider>
            </InventoryProvider>
          </AttributeProvider>
        </AttributeValueProvider>
      </ProductProvider>
  );
};

export default LayoutProductAdmin;
