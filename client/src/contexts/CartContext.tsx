import { createContext } from "react"
import { ICart } from "../interfaces/ICart"

const CartContext = createContext({} as {
    dispatch:any,
    carts:ICart[],
})

export default CartContext