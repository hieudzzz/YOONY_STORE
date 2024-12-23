import { useEffect, useReducer } from "react";
import { IProduct } from "../interfaces/IProduct";
import axios from "axios";
import { toast } from "react-toastify";
import instance from "../instance/instance";
import TrashContext, { Props } from "../contexts/TrashContext";
import TrashReducer from "../reducer/TrashReducer";

const TrashProvider = (props: Props) => {
  const [trashProducts, dispatch] = useReducer(TrashReducer, [] as IProduct[]);
  useEffect(() => {
    (async () => {
      try {
        const {data:{data:response}} = await instance.get("listDelete");
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
    <TrashContext.Provider value={{ trashProducts, dispatch }}>
      {props.children}
    </TrashContext.Provider>
  );
};

export default TrashProvider;
