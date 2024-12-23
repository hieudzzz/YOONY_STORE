import { IProduct } from "../interfaces/IProduct";

const TrashReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LIST":
      return action.payload;
    case "ADD":
      return [action.payload, ...state];
    case "UPDATE":
      return state.map((item: IProduct) => {
        if (item.id !== action.payload.id) {
          return item;
        }
        return action.payload;
      });
    case "DELETE":
      return state.filter((item: IProduct) => {
        return item.id !== action.payload;
      });
    case "DELETE_MULTIPLE":
      return state.filter(
        (item: IProduct) => !action.payload.includes(item.id)
      );

    default:
      break;
  }
};

export default TrashReducer;
