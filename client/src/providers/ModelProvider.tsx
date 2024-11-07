import { useEffect, useReducer } from "react";
import instance from "../instance/instance";
import axios from "axios";
import { IModel } from "../interfaces/IModel";
import ModelReducer from "../reducer/ModelReducer";
import { ModelContext, Props } from "../contexts/ModelContext";

const ModelProvider = (props: Props) => {
  const [models, dispatch] = useReducer(ModelReducer, [] as IModel[]);
  useEffect(() => {
    (async () => {
      try {
        const {
          data: { data: {data:response} },
        } = await instance.get("models");
        dispatch({
          type: "LIST",
          payload: response,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data?.message);
        } else if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("Đã xảy ra lỗi không mong muốn");
        }
      }
    })();
  }, []);
  return (
    <ModelContext.Provider value={{ models, dispatch }}>
      {props.children}
    </ModelContext.Provider>
  );
};

export default ModelProvider;
