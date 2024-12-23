enum VoucherType {
    Fixed = 'fixed',
    Percentage = 'percentage',
}
export interface IVoucher{
    name?:string,
    description?:string,
    id?:number,
    code:string,
    discount:number,
    discount_type:VoucherType,
    usage_limit: number,
    min_order_value: number | null,
    max_order_value: number | null,
    start_date: string,
    end_date: string,
    status:boolean,
    max_discount:number | null
}