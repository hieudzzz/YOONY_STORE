import { createContext, ReactNode } from "react";
import { ISupplier } from "../interfaces/ISupplier";


export interface Props{
    children:ReactNode
}

export const SupplierContext = createContext({} as{
    suppliers: ISupplier[],
    dispatch:any;
})


