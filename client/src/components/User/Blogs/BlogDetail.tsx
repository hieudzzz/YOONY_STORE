import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HTMLReactParser, { domToReact, Element } from "html-react-parser";
import { IBlog } from "../../../interfaces/IBlogs";
import instance from "../../../instance/instance";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [hasFeaturedImage, setHasFeaturedImage] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get(`/detailBlog/${slug}`);
        const blogContent = data.blog.content;

        HTMLReactParser(blogContent, {
          replace: (domNode) => {
            if (domNode instanceof Element) {
              if (domNode.tagName === "img" && !hasFeaturedImage) {
                setFeaturedImage(domNode.attribs.src);
                setHasFeaturedImage(true);
                return null;
              }

              if (domNode.tagName === "h1" && !title) {
                setTitle(domToReact(domNode.children));
              }

              if (domNode.tagName === "h1") {
                return (
                  <h1 className="font-bold">
                    <strong>{domToReact(domNode.children)}</strong>
                  </h1>
                );
              }
            }
          },
        });

        setBlog({ ...data.blog });
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    })();
  }, [slug, hasFeaturedImage, title]);

  if (!blog) {
    return <p className="text-center">Đang tải dữ liệu...</p>;
  }

  return (
    <main className="container-main pb-10 mt-8">
      <div className="container m-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              {featuredImage && (
                <img
                  src={featuredImage}
                  className="w-full h-[304px] object-cover p-2"
                  alt={blog.slug}
                />
              )}
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  <strong>{title}</strong>
                </h1>
              )}
              <p className="text-sm text-gray-500 mb-4">
                Người viết: {blog.user_id}
              </p>

              <div className="text-lg text-gray-700">
                {HTMLReactParser(blog.content, {
                  replace: (domNode) => {
                    if (
                      domNode instanceof Element &&
                      domNode.tagName === "img" &&
                      domNode.attribs.src === featuredImage
                    ) {
                      return null;
                    }
                  },
                })}
              </div>

              <div className="share-buttons text-center mt-8 mb-6">
                <h4 className="text-xl font-semibold mb-4">CHIA SẺ BÀI VIẾT</h4>
                <div className="flex justify-center space-x-2 ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 16.9913 5.65783 21.1283 10.4385 21.8785V14.8906H7.89941V12H10.4385V9.79688C10.4385 7.29063 11.9314 5.90625 14.2156 5.90625C15.3097 5.90625 16.4541 6.10156 16.4541 6.10156V8.5625H15.1931C13.9509 8.5625 13.5635 9.33334 13.5635 10.1242V12H16.3369L15.8936 14.8906H13.5635V21.8785C18.3441 21.1283 22.001 16.9913 22.001 12C22.001 6.47715 17.5238 2 12.001 2Z"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="space-y-6">
              <aside className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">"Quote"</h3>
                <p className="text-gray-600 italic">"Insert an inspiring or relevant quote here."</p>
              </aside>

              <aside className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">"Quote"</h3>
                <p className="text-gray-600 italic">"Another inspiring quote goes here."</p>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
