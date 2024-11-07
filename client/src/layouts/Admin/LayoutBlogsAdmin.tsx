import BlogProvider from "../../contexts/BlogsContext"
import BlogsAdmin from "../../pages/admin/blogs/BlogsAdmin"

const LayoutBlogsAdmin=()=>{
    return (
        <BlogProvider>
            <BlogsAdmin/>
        </BlogProvider>
    )
}

export default LayoutBlogsAdmin