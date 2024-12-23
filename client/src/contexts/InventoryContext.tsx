import { createContext, ReactNode } from "react"
import { IProduct } from "../interfaces/IProduct"

export interface Props{
    children:ReactNode
} 

const InventoryContext = createContext({} as {
    dispatch:any,
    inventorys:IProduct[],
})

export default InventoryContext