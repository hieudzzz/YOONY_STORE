import { useEffect, useReducer } from "react";
import ProductContext, { Props } from "../contexts/ProductContext";
import { IProduct } from "../interfaces/IProduct";
import ProductReducer from "../reducer/ProductReducer";
import axios from "axios";
import { toast } from "react-toastify";
import instance from "../instance/instance";

const ProductProvider = (props: Props) => {
  const [products, dispatch] = useReducer(ProductReducer, [] as IProduct[]);
  useEffect(() => {
    (async () => {
      try {
        const {data:{data:response}} = await instance.get("products");
        dispatch({
            type:"LIST",
            payload:response
        })
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        } else if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("Đã xảy ra lỗi không mong muốn");
        }
      }
    })();
  }, []);
  return (
    <ProductContext.Provider value={{ products, dispatch }}>
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
