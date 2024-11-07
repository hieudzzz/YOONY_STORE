import { IAttributeValue } from "./IAttributeValue";
import { IProduct } from "./IProduct";
import { IUser } from "./IUser";
import { IVariants } from "./IVariants";

export interface ICart{
    id:number,
    quantity:number,
    variant_id:IVariants,
    user_id:IUser,
    variant:{
        image:string,
        price:number
        attribute_values:IAttributeValue,
        product:IProduct,
        quantity:number,
        sale_price:number
    }
}
