export interface IUser{
    id?:number,
    name:string,
    email:string,
    tel:number,
    address:string,
    avatar:string,
    status?: boolean,
    password?: string;
    address_id?:number;
    provider:string;
    confirmPass?: string;
    role?: "member" | "admin"
}
