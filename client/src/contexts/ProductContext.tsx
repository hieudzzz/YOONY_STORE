import { createContext, ReactNode } from "react"
import { IProduct } from "../interfaces/IProduct"

export interface Props{
    children:ReactNode
} 

const ProductContext = createContext({} as {
    products:IProduct[],
    dispatch:any
})

export default ProductContext