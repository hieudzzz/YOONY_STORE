import { useEffect, useReducer } from "react";
import { Props, RoleContext } from "../contexts/RoleContext";
import { IRole } from "../interfaces/IRole";
import RoleReducer from "../reducer/RoleReducer";
import instance from "../instance/instance";
import axios from "axios";

const RoleProvider = (props: Props) => {
  const [roles, dispatch] = useReducer(RoleReducer, [] as IRole[]);
  useEffect(() => {
    (async () => {
      try {
        const {
          data: { data: response },
        } = await instance.get("roles");
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
    <RoleContext.Provider value={{ roles, dispatch }}>
      {props.children}
    </RoleContext.Provider>
  );
};

export default RoleProvider;
