import { ReactNode, createContext, useReducer } from "react";
import { IUser } from "../interfaces/IUser";
import userReducer from "../reducer/UserReducer";

interface Prop {
  children: ReactNode;
}
export const UserContext = createContext(
  {} as {
    users: IUser[];
    dispatch: any;
  }
);

const UserPovider = (props: Prop) => {
  const [users, dispatch] = useReducer(userReducer, [] as IUser[]);
  return (
    <UserContext.Provider value={{ users, dispatch }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserPovider;
