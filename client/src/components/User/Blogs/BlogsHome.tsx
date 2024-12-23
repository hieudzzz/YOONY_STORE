import { Link } from "react-router-dom";
import { IBlog } from "../../../interfaces/IBlogs";
import ButtonSeeMore from "../Button/ButtonSeeMore";
type Prop = {
  blogs: IBlog[];
};
export default function BlogHome({blogs}:Prop) {

  const extractFirstImage = (content: string): string | null => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const img = doc.querySelector("img");
    return img ? img.src : null;
  };

  const extractTextContent = (content: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    return doc.body.textContent || "";
  };

  const extractH1Tag = (content: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const h1 = doc.querySelector("h1");
    return h1 ? h1.textContent || "" : "No title";
  };

  return (
    <main className="container-main pb-24">
      <div className="container m-auto">
        <h2 className="text-2xl font-bold mb-10 text-primary flex justify-center mt-4">
          BÀI VIẾT
        </h2>
        <div className="flex gap-4">
          {blogs && blogs.length > 0 && (
            <Link
              to={`/blogs/${blogs[0].slug}`}
              className="relative flex-1 bg-white rounded-lg shadow-lg"
            >
              <div className="">
                <img
                  src={blogs[0].thumbnail}
                  className="w-full h-[380px] rounded-md object-cover"
                  alt={blogs[0].slug}
                />
                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end mb-10">
                  <div className="bg-white translate-y-24 bg-opacity-90 p-4 space-y-2 rounded-md mx-auto w-[90%] shadow-md">
                    <p className="line-clamp-2 font-semibold">
                      {blogs[0].title}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      Người viết: {blogs[0].user.name}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {extractTextContent(blogs[0].content)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}
          <div
            className="flex-1 flex flex-col space-y-4 overflow-y-auto"
            style={{ maxHeight: "380px" }}
          >
            {blogs &&
              blogs.length > 1 &&
              blogs.slice(1).map((blog) => (
                <div
                  key={blog.id}
                  className="flex bg-white rounded-lg shadow-md"
                >
                  <img
                    src={blog.thumbnail}
                    className="w-[204px] h-[146px] object-cover"
                    alt={blog.slug}
                  />
                  <div className="p-4 flex-1">
                    <Link
                      to={`/blogs/${blog.slug}`}
                      className="text-base font-bold text-gray-700 mb-2"
                    >
                      {blog.title}
                   
                    <p className="text-sm text-gray-500 mb-2">
                      Người viết: {blog.user.name}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {extractTextContent(blog.content)}
                    </p>
                     </Link>
                  </div>
                </div>
              ))}
            {blogs.length > 5 && (
              <div className="flex justify-center mt-6">
                <ButtonSeeMore link="/blogs" />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
