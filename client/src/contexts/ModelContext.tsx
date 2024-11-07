import { createContext, ReactNode } from "react";
import { IModel } from "../interfaces/IModel";

export interface Props{
    children:ReactNode
}

export const ModelContext = createContext({} as{
    models: IModel[],
    dispatch:any;
})

