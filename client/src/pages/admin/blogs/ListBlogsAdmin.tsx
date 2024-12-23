import { Table } from "flowbite-react";
import { useContext, useEffect } from "react";
import instance from "../../../instance/instance";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { BlogContext } from "../../../contexts/BlogsContext";
import { Avatar, ConfigProvider, Switch } from "antd";
import dayjs from "dayjs";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { IMeta } from "../../../interfaces/IMeta";
type Props = {
  setMeta: (meta: IMeta) => void;
  page: number;
  setSearchParams: (params: Record<string, string | number | boolean>) => void;
};
const ListBlogsAdmin = ({ setMeta, page, setSearchParams }: Props) => {
  const { blogs, dispatch } = useContext(BlogContext);
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };
  useEffect(() => {
    (async () => {
      setSearchParams({ page: String(page) });
      const { data } = await instance.get("blogs");
      setMeta(data.meta);
      dispatch({
        type: "LIST",
        payload: data.data,
      });
    })();
  }, []);
  const handleRemoveBlog = async (id: number) => {
    try {
      await instance.delete(`blogs/${id}`);
      dispatch({
        type: "DELETE",
        payload: id,
      });
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleUpdateActiveBlog = async (id: number, is_active: boolean) => {
    try {
      const { data } = await instance.patch(`blogs/${id}/is-active`, {
        is_active: is_active,
      });
      dispatch({
        type: "UPDATE",
        payload: data.blog,
      });
      if (is_active) {
        toast.success("Hiển thị");
      } else {
        toast.warning("Ẩn bài viết");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  return (
    <div className="overflow-x-auto w-full">
      <Table className="table w-full border-b border-[#E4E7EB]">
        <Table.Head className="text-center">
          <Table.HeadCell
            className="bg-[#F4F7FA] text-secondary/75 text-sm text-left font-medium capitalize text-nowrap"
            style={{ width: "35%" }}
          >
            Ảnh và Bài Viết
          </Table.HeadCell>
          <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
            Tác Giả
          </Table.HeadCell>
          <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
            Ngày tạo
          </Table.HeadCell>
          <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
            Trạng thái
          </Table.HeadCell>
          <Table.HeadCell className="bg-[#F4F7FA] text-secondary/75 text-sm font-medium capitalize text-nowrap">
            Hành động
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {blogs.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={6}>
                <div className="flex flex-col items-center text-secondary/20 space-y-2 justify-center min-h-[50vh]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-16"
                    viewBox="0 0 64 41"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      transform="translate(0 1)"
                    >
                      <ellipse
                        cx="32"
                        cy="33"
                        fill="#f5f5f5"
                        rx="32"
                        ry="7"
                      ></ellipse>
                      <g fillRule="nonzero" stroke="#d9d9d9">
                        <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                        <path
                          fill="#fafafa"
                          d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                        ></path>
                      </g>
                    </g>
                  </svg>
                  <p>Không có bài viết nào</p>
                </div>
              </Table.Cell>
            </Table.Row>
          ) : (
            blogs.map((blog) => {
              return (
                <Table.Row className="text-center" key={blog.id}>
                  <Table.Cell>
                    <div className="flex gap-2.5">
                      <Avatar shape="square" src={blog.thumbnail} size={64} />
                      <div className="max-w-[300px] space-y-0.5">
                        <p className="text-left font-medium text-nowrap text-ellipsis overflow-hidden">
                          {blog.title}
                        </p>
                        <p className="text-left text-nowrap text-ellipsis overflow-hidden text-sm text-secondary/50">
                          {stripHtml(blog.content).slice(0, 50)}
                        </p>
                        <p className="text-left text-nowrap text-ellipsis overflow-hidden text-sm text-secondary/50">
                          Cập nhật:{" "}
                          <span className="text-primary/75">
                            {dayjs(blog.updated_at).format("DD-MM-YYYY")}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-nowrap">
                    {blog.user.name}
                  </Table.Cell>
                  <Table.Cell className="text-nowrap">
                    {dayjs(blog.created_at).format("DD-MM-YYYY")}
                  </Table.Cell>
                  <Table.Cell>
                    <ConfigProvider
                      theme={{
                        token: {
                          colorPrimary: "#ff9900",
                        },
                      }}
                    >
                      <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={blog.is_active ? true : false}
                        onChange={() => {
                          handleUpdateActiveBlog(blog.id!, !blog.is_active);
                        }}
                      />
                    </ConfigProvider>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`${blog.id}`}
                        className="bg-util shadow py-1.5 px-3 rounded-md"
                      >
                        <svg className="size-5" fill="none" viewBox="0 0 20 20">
                          <path
                            stroke="#1FD178"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit="10"
                            strokeWidth="1.5"
                            d="M11.05 3l-6.842 7.242c-.258.275-.508.816-.558 1.191l-.308 2.7c-.109.975.591 1.642 1.558 1.475l2.683-.458c.375-.067.9-.342 1.159-.625l6.841-7.242c1.184-1.25 1.717-2.675-.125-4.416C13.625 1.142 12.233 1.75 11.05 3zM9.908 4.208A5.105 5.105 0 0014.45 8.5M2.5 18.333h15"
                          ></path>
                        </svg>
                      </Link>
                      <button
                        className="bg-util shadow py-1.5 px-3 rounded-md"
                        onClick={() => {
                          swal({
                            title: "Bạn có muốn xóa bài viết này ?",
                            text: "Sau khi xóa sẽ không thể khôi phục !",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                            className: "my-swal",
                          }).then((willDelete) => {
                            if (willDelete) {
                              handleRemoveBlog(blog.id!);
                              toast.success("Xoá bài viết thành công");
                            }
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="red"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ListBlogsAdmin;
