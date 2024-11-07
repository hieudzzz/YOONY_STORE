import { IVoucher } from "../interfaces/IVouchers"
const voucherReducer = (state:any,action:any) => {
  switch (action.type) {
    case "LIST":
        return action.payload
    case "ADD":
        return [action.payload,...state]
    case "UPDATE":
        return state.map((item:IVoucher)=>{
            if (item.id !==action.payload.id) {
                return item
            }
            return action.payload
        })
    case "DELETE":
        return state.filter((item: IVoucher) => item.id !== action.payload);
    default:
        break;
  }
}
export default voucherReducer