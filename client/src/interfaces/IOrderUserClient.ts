import { AttributeValues } from "./IOrders";
import { IUser } from "./IUser";
import { IVariants } from "./IVariants";
import { IVoucher } from "./IVouchers";

interface ItemsOrder {
    quantity: number,
    total_price: number
    unit_price: number,
    variant: IVariants
    product_name?: string;
    product_image?: string;
    order_item_attribute?: AttributeValues[] | undefined;

}
export interface IOrderUserClient {
    id?: number;
    userId: number;
    grand_total: number;
    final_total: number;
    payment_method: string;
    status_order: string;
    code: string;
    notes: string;
    name: string;
    tel: string;
    address: string;
    paid_at: string;
    complete_at: string;
    created_at: string;
    updated_at: string;
    coupons:CouponUsage[]
    items: ItemsOrder[],
    user:IUser,
    is_delivered:number[]
}

interface CouponUsage {
    id: number;
    order_id: number;
    coupon_id: number;
    discount_amount: string;
    created_at: string;
    updated_at: string; 
    coupon: IVoucher; 
}

