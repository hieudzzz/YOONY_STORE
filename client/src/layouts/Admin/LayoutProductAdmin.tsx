import { Outlet } from "react-router-dom"
import ProductProvider from "../../providers/ProductProvider"

const LayoutProductAdmin = () => {
  return (
    <ProductProvider>
        <Outlet/>
    </ProductProvider>
  )
}

export default LayoutProductAdmin