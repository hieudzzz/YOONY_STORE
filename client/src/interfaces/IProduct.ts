
import { ICategory } from "./ICategory";
import { IVariants } from "./IVariants";

export interface IProduct{
    id?:number,
    name:string,
    slug:string,
    images:string[],
    category?:ICategory
    description:string,
    category_id:ICategory,
    is_active:boolean,
    is_good_deal:boolean,
    is_featured:boolean,
    is_variant:boolean,
    variants:IVariants[]
}