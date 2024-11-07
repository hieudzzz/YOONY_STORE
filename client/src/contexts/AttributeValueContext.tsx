import { createContext, ReactNode } from "react";
import { IAttributeValue } from "../interfaces/IAttributeValue";

export interface Props{
    children:ReactNode
}

export const AttributeValueContext = createContext({} as{
    attributeValues: IAttributeValue[],
    dispatch:any;
})



