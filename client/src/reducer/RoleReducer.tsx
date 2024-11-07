import { IRole } from "../interfaces/IRole"
const RoleReducer = (state:any,action:any) => {
  switch (action.type) {
    case "LIST":
        return action.payload
    case "ADD":
        return [...state,action.payload]
    case "UPDATE":
         return state.map((item:IRole)=>{
            if (item.id !== action.payload.id) {
                return item
            } return action.payload
         })
    case "DELETE":
        return state.filter((item:IRole)=>{
            return item.id !== action.payload
        })
  
    default:
        break;
  }
}

export default RoleReducer