import { ReactNode, createContext, useReducer } from "react";
import { IBanner } from "../interfaces/IBanners";
import BannerReducer from "../reducer/Banner";

interface Props{
    children:ReactNode
}
export const BannerContext = createContext({} as {
    banners:IBanner[],
    dispatch:any
})

const BannerProvider=(props:Props)=>{
    const [banners,dispatch]=useReducer(BannerReducer,[] as IBanner[])
    return (
        <BannerContext.Provider value={{banners,dispatch}}>
            {props.children}
        </BannerContext.Provider>
    )
}

export default BannerProvider