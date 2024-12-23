export interface IWishlist {
    id: number;
    user_id: number;
    product_id: number;
    created_at: string;
    updated_at: string;
}


export interface WishlistResponse {
    message: string;
    status: string;
    wishlist: IWishlist;
}