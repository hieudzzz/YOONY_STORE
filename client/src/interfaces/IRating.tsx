import { IAttributeValue } from "./IAttributeValue";
import { ICategory } from "./ICategory";

export interface IRatingOrder {
    order_id: number;
    user_id: number;
    grand_total: number;
    final_total: number;
    payment_method: string;
    status_order: string;
    code: string;
    notes: string | null;
    name: string;
    tel: string;
    address: string;
    items: OrderItem[];
}

interface OrderItem {
    product: Product;
    variant_lists: VariantList[];
    review: null | any; 
}

interface Product {
    id: number;
    name: string;
    slug: string;
    images: string[];
    description: string;
    category_id: number;
    is_featured: number;
    category?:ICategory
    is_good_deal: number;
    is_active: number;
    deleted_at: null | string;
    created_at: string;
    updated_at: string;

}

interface VariantList {
    id: number;
    order_id: number;
    variant_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    variant: Variant;
}

interface Variant {
    id: number;
    price: number;
    sale_price: number | null;
    end_sale: null | string;
    image: string | null;
    product_id: number;
    created_at: string;
    updated_at: string;
    product: Product;
    attribute_values:IAttributeValue
}