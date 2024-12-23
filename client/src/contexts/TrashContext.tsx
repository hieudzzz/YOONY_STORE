import { createContext, ReactNode } from "react"
import { IProduct } from "../interfaces/IProduct"

export interface Props{
    children:ReactNode
} 

const TrashContext = createContext({} as {
    trashProducts:IProduct[],
    dispatch:any
})

export default TrashContext