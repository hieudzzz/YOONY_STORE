import { IBlog } from "../interfaces/IBlogs"

const BlogReducer = (state:any,action:any) => {
  switch (action.type) {
    case "LIST":
        return action.payload
    case "ADD":
        return [action.payload,...state]
    case "UPDATE":
        return state.map((item:IBlog)=>{
            if (item.id !== action.payload.id) {
                return item
            }
            return action.payload
        })
    case "DELETE":
        return state.filter((item:IBlog)=>{
            return item.id !== action.payload
        })
    default:
        break;
  }
}

export default BlogReducer