import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IBlog } from "../../../interfaces/IBlogs";
import instance from "../../../instance/instance";

export default function BlogHome() {
    const [blogs, setBlog] = useState<IBlog[]>([]);

    useEffect(() => {
        (async () => {
            const { data } = await instance.get("/blogs");
            setBlog(data.data);
        })();
    }, []);

    const extractFirstImage = (content: string): string | null => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const img = doc.querySelector("img");
        return img ? img.src : null;
    };

    const extractH1Tag = (content: string): string => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const h1 = doc.querySelector("h1");
        return h1 ? h1.textContent || "" : "No title";
    };

    return (
        <main className="container-main pb-20">
            <div className="container m-auto">
                <h2 className="text-2xl font-bold mb-10 text-orange-500 flex justify-center mt-4">TIN TỨC</h2>

                {/* Grid Layout for All Blogs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.length > 0 &&
                        blogs.map((blog, index) => (
                            <div
                                key={blog.id}
                                className={`bg-white rounded-lg overflow-hidden flex flex-col items-center ${
                                    index === 1 ? 'h-[500px]' : ''
                                }`}
                            >
                                <div className="relative w-full h-58">
                                    <img
                                        src={extractFirstImage(blog.content) || blog.image}
                                        className="w-full h-full object-cover"
                                        alt={blog.slug}
                                    />
                                </div>
                                <div className="p-4 text-center">
                                    <h1 className="text-lg font-bold text-gray-700 mb-2">
                                        {extractH1Tag(blog.content)}
                                    </h1>
                                    <p className="text-sm text-gray-500 mb-2 flex items-center justify-center gap-2">
                                        Người viết: {blog.user_id} - {new Date(blog.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </main>
    );
}
