export interface Irates {
    [x: string]: any;
    id?: number;
    content: string;
    created_at: string;
    updated_at: string;
    rating: number; // Số sao (1-5)
    order_id: number;
    product_id: number;
    user_id: number;
    user: IUser; // Tham chiếu tới interface IUser
    product: IProductRate; // Tham chiếu tới interface IProduct
}
export interface IProductRate {
    id: number;
    name: string;
    slug: string;
    description: string;
    images: string; // Dạng JSON string
    category_id: number;
    is_active: number;
    is_featured: number;
    is_good_deal: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
    address: string | null;
    tel: string | null;
    provider: string | null;
    provider_id: string | null;
    created_at: string;
    updated_at: string;
    email_verified_at: string | null;
}