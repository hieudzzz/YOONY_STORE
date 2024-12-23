import { IUser } from "../interfaces/IUser"


const userReducer = (state:any,action:any) => {
  switch (action.type) {
    case "LIST":
        return action.payload
    case "UPDATE":
        return state.map((item:IUser)=>{
            if (item.id !==action.payload.id) {
                return item
            }
            return action.payload
        })
  
    default:
        break;
  }
}

export default userReducer