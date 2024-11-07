import { useEffect, useReducer } from "react";
import instance from "../instance/instance";
import axios from "axios";
import RoleHasModelReducer from "../reducer/RoleHasModelReducer";
import { IRoleHasModel } from "../interfaces/IRoleHasModel";
import { Props, RoleHasModelContext } from "../contexts/RoleHasModelContext";

const RoleHasModelProvider = (props: Props) => {
  const [role_has_models, dispatch] = useReducer(RoleHasModelReducer, [] as IRoleHasModel[]);
  useEffect(() => {
    (async () => {
      try {
        const {
          data: { data: response },
        } = await instance.get("all-models-by-role");
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
    <RoleHasModelContext.Provider value={{ role_has_models, dispatch }}>
      {props.children}
    </RoleHasModelContext.Provider>
  );
};

export default RoleHasModelProvider;
