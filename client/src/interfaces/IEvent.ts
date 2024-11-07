export interface IEvent{
    id?:number,
    name:string,
    description:string,
    start_date: string,
    end_date: string,
    is_active:boolean,
    coupons:string[]
}