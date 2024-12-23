
import { useReducer } from "react";
import { Props, SupplierContext } from "../contexts/SupplierContext";
import { ISupplier } from "../interfaces/ISupplier";
import SupplierReducer from "../reducer/SupplierReducer";

const SupplierProvider = (props: Props) => {
  const [suppliers, dispatch] = useReducer(
    SupplierReducer,
    [] as ISupplier[]
  );
  return (
    <SupplierContext.Provider value={{ suppliers, dispatch }}>
      {props.children}
    </SupplierContext.Provider>
  );
};

export default SupplierProvider;
