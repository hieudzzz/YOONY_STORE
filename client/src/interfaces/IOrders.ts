export interface Orders {
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
    items: ItemProduct[];
    profit:number;
    product: OrderProduct[];
    user: User;
    coupons:Coupons[];
    is_delivered:[]
}
export interface ItemProduct {
    id?: number;
    orderId: number;
    varriantId: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at: string;
    updated_at: string;
    variant: Varriant;
};
export interface Varriant {
    id?: string;
    attribute_values: AttributeValues[];
    create_at: string;
    end_sale: string;
    image: string;
    price: number;
    product: OrderProduct;
    product_id: number;
    sale_price: number;
    update_at: string
}

export interface AttributeValues {
    id?: string;
    attribute: Attribute;
    attribute_id: number;
    create_at: string;
    pivot: Pivot;
    update_at: string;
    value: string;
}
export interface OrderProduct {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string;
    images: string; // có thể chuyển thành mảng nếu cần thiết
    is_active: number;
    is_featured: number;
    is_good_deal: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
export interface Attribute {
    id?: number;
    name: string;
    slug: string;
    type: string;
    create_at: string;
    update_at: string;
}

export interface Pivot {
    attribute_value_id: number;
    variant_id: number;
}

export interface User {
    address: string;
    avatar: string;
    create_at: string;
    email: string;
    name:string;
    email_verified_at: string;
    id: number;
    provider: string;
    provider_id: string;
    tel: string;
    update_at: string
}

export interface Coupons {
    id?: number;
    coupon: Coupon;
    coupon_id: number;
    created_at: string;
    discount_amount: number;
    order_id: number;
    updated_at: string;


}
export interface Coupon {
    id: number;
    code: string;
    name: string;
    description: string;
    discount: number;
    discount_type: "fixed" | "percentage"; // Kiểu "fixed" hoặc "percentage"
    min_order_value: number | null;
    max_order_value: number | null;
    usage_limit: number;
    winning_probability: number;
    start_date: string; // Có thể dùng kiểu `Date` nếu bạn muốn xử lý với đối tượng `Date`
    end_date: string;
    status: boolean;
    type: "coupon" | "otherType"; // Kiểu "coupon" hoặc các loại khác (tùy vào yêu cầu thực tế)
    created_at: string | null; // Có thể dùng `Date` nếu cần
    updated_at: string | null; // Có thể dùng `Date` nếu cần
}


export interface UserOrder {
    id?:number;
    address:string;
    avatar:string;
    created_at:string;
    email:string;
    name:string
}