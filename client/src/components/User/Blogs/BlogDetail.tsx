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
  const [otherBlogs, setOtherBlogs] = useState<IBlog[]>([]);

  const handleFacebookShare = () => {
    const blogUrl = window.location.href;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`;
    window.open(facebookShareUrl, "_blank", "width=600,height=400");
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get(`/detailBlog/${slug}`);
        const blogContent = data.blog.content;

        HTMLReactParser(blogContent, {
          replace: (domNode) => {
            if (domNode instanceof Element) {
              if (domNode.tagName === "img" && !hasFeaturedImage) {
                setFeaturedImage(domNode.attribs.src); // Lấy ảnh đầu tiên làm featuredImage
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

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("list-blogs");
        setOtherBlogs(data.data);
      } catch (error) {
        console.error("Error fetching other blogs:", error);
      }
    })();
  }, []);

  if (!blog) {
    return <p className="text-center">Đang tải dữ liệu...</p>;
  }

  return (
    <main className="container-main pb-10 mt-8">
      <div className="container m-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Nội dung bài viết */}
          <div className="lg:w-2/3">
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6 space-y-3">
              {/* Ảnh bài viết */}
              {(blog.thumbnail || featuredImage) && (
                <img
                  src={blog.thumbnail || featuredImage}
                  className="w-full h-[386px] object-cover rounded-sm"
                  alt={blog.slug}
                />
              )}
              {/* Tiêu đề bài viết */}
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  <strong>{title}</strong>
                </h1>
              )}
              <p className="text-sm text-gray-500 mb-4">
                Người viết: {blog.user.name}
              </p>

              {/* Nội dung bài viết */}
              <div className="text-lg text-gray-700">
                {HTMLReactParser(blog.content, {
                  replace: (domNode) => {
                    if (
                      domNode instanceof Element &&
                      domNode.tagName === "img" &&
                      domNode.attribs.src === featuredImage
                    ) {
                      return null; // Loại bỏ ảnh đã làm featuredImage
                    }
                  },
                })}
              </div>

              {/* Chia sẻ bài viết */}
              <div className="share-buttons text-center mt-8 mb-6">
                <h4 className="text-xl font-semibold mb-4">CHIA SẺ BÀI VIẾT</h4>
                <button className="mx-auto space-x-2" onClick={handleFacebookShare}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25px"
                    height="25px"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 16.9913 5.65783 21.1283 10.4385 21.8785V14.8906H7.89941V12H10.4385V9.79688C10.4385 7.29063 11.9314 5.90625 14.2156 5.90625C15.3097 5.90625 16.4541 6.10156 16.4541 6.10156V8.5625H15.1931C13.9509 8.5625 13.5635 9.33334 13.5635 10.1242V12H16.3369L15.8936 14.8906H13.5635V21.8785C18.3441 21.1283 22.001 16.9913 22.001 12C22.001 6.47715 17.5238 2 12.001 2Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Các bài viết khác */}
          <div className="lg:w-1/3">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Các bài viết khác</h3>
              {otherBlogs
                .filter((otherBlog) => otherBlog.slug !== slug) // Lọc bỏ bài viết hiện tại
                .map((otherBlog) => (
                  <div
                    key={otherBlog.id}
                    className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    style={{ height: '280px', overflow: 'hidden' }}
                  >
                    <a href={`/blogs/${otherBlog.slug}`} className="flex flex-col h-full">
                      <img
                        src={otherBlog.thumbnail}
                        alt={otherBlog.title}
                        className="w-full h-[140px] object-cover rounded-sm mb-3"
                      />
                      {/* Title */}
                      <h4 className="text-sm font-semibold text-gray-800 truncate">
                        {otherBlog.title}
                      </h4>
                      {/* Content with truncation */}
                      <p className="text-ml text-gray-600 mt-2 line-clamp-2 overflow-hidden">
                        {HTMLReactParser(otherBlog.content, {
                          replace: (domNode) => {
                            if (domNode instanceof Element && domNode.tagName === "p") {
                              const contentText = domToReact(domNode.children);
                              const maxLength = 100;

                              const shortContent =
                                typeof contentText === "string" && contentText.length > maxLength
                                  ? contentText.substring(0, maxLength) + "..."
                                  : contentText;
                              return <>{shortContent}</>;
                            }
                          },
                        })}
                      </p>
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
