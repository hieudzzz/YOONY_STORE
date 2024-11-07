import { ReactNode, createContext, useReducer } from "react";
import BlogReducer from "../reducer/BlogReducer";
import { IBlog } from "../interfaces/IBlogs";

interface Props{
    children:ReactNode
}
export const BlogContext = createContext({} as {
    blogs:IBlog[],
    dispatch:any
})

const BlogProvider=(props:Props)=>{
    const [blogs,dispatch]=useReducer(BlogReducer,[] as IBlog[])
    return (
        <BlogContext.Provider value={{blogs,dispatch}}>
            {props.children}
        </BlogContext.Provider>
    )
}

export default BlogProvider