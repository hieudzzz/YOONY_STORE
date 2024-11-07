export interface IRoleHasModel{
    id?:number,
    role_id:number,
    model_id:number
    role?:{
        id?:number
        name:string,
        models:{
            name:string,
            type:string
        }[]
    }

}