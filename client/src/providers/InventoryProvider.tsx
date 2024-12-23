import { useEffect, useReducer } from "react";
import instance from "../instance/instance";
import InventoryContext, { Props } from "../contexts/InventoryContext";
import InventoryReducer from "../reducer/InventoryReducer";
import { IProduct } from "../interfaces/IProduct";

const InventoryProvider = (props: Props) => {
  const [inventorys, dispatch] = useReducer(
    InventoryReducer,
    [] as IProduct[]
  );
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const { data } = await instance.get(
  //         `productsWithInventoryImports`
  //       );
  //       if (data) {
  //         dispatch({
  //           type: "LIST",
  //           payload: data.data,
  //         });
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   })()
  // }, [])
  return (
    <InventoryContext.Provider value={{ inventorys, dispatch }}>
      {props.children}
    </InventoryContext.Provider>
  );
};

export default InventoryProvider;
