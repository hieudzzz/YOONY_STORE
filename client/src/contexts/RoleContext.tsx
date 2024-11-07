import { createContext, ReactNode } from "react";
import { IRole } from "../interfaces/IRole";

export interface Props{
    children:ReactNode
}

export const RoleContext = createContext({} as{
    roles: IRole[],
    dispatch:any;
})

