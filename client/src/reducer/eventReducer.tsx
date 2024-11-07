import { IEvent } from "../interfaces/IEvent"

const eventReducer = (state:any,action:any) => {
  switch (action.type) {
    case "LIST":
        return action.payload
    case "ADD":
        return [action.payload,...state]
    case "UPDATE":
        return state.map((item:IEvent)=>{
            if (item.id !== action.payload.id) {
                return item
            }
            return action.payload
        })
    case "DELETE":
        return state.filter((item:IEvent)=>{
            return item.id !== action.payload
        })
    default:
        break;
  }
}

export default eventReducer