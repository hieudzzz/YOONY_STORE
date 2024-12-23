import { createContext, ReactNode } from "react";
import { IAddress } from "../interfaces/IAddress";

export interface Props{
    children:ReactNode
}

export const AddressContext = createContext({} as{
    addresses: IAddress[],
    dispatch:any;
})


