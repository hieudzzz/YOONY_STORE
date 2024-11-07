import { createContext, ReactNode } from "react";
import { IAttribute } from '../interfaces/IAttribute';

export interface Props{
    children:ReactNode
}

export const AttributeContext = createContext({} as{
    attributes: IAttribute[],
    dispatch:any;
})



