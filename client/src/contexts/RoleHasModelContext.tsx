import { createContext, ReactNode } from "react";
import { IRoleHasModel } from "../interfaces/IRoleHasModel";

export interface Props{
    children:ReactNode
}

export const RoleHasModelContext = createContext({} as{
    role_has_models: IRoleHasModel[],
    dispatch:any;
})

