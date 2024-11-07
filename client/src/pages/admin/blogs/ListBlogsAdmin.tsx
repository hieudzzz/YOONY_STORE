import { Table, ToggleSwitch } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import instance from "../../../instance/instance";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { BlogContext } from "../../../contexts/BlogsContext";

const ListBlogsAdmin = () => {
  const { blogs, dispatch } = useContext(BlogContext);
  const [statusBlog, setActive] = useState(true);
  useEffect(() => {
    (async () => {
      const { data } = await instance.get("blogs");
      dispatch({
        type: "LIST",
        payload: data.data,
      });
    })();
  }, []);

  const handleRemoveBlo = async (id: number) => {
    try {
      await instance.delete(`blogs/${id}`);
      dispatch({
        type: "DELETE",
        payload: id,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleUpdateActiveBlog = async (id: number, activeBlog: boolean) => {
    try {
      const { data } = await instance.patch(`blogs/${id}/is-active`, {  
        is_active: activeBlog,
      });
      dispatch({
        type: "UPDATE",
        payload: data.blog,
      });
      if (activeBlog) {
        toast.success("Public");
      } else {
        toast.warning("Private");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
  }
  
  };
  return (
    <div className="overflow-x-auto w-full">
      <Table hoverable className="table w-full">
        <Table.Head className="text-center">
          <Table.HeadCell>STT</Table.HeadCell>
          <Table.HeadCell>Bài Viết</Table.HeadCell>
          <Table.HeadCell>Nội Dung</Table.HeadCell>
          <Table.HeadCell>Tác Giả</Table.HeadCell>
          <Table.HeadCell>Trạng thái</Table.HeadCell>
          <Table.HeadCell>Hành động</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {blogs.map((blog, index) => {
            return (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
                key={blog.id}
              >
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{blog.slug}</Table.Cell> 
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {blog.content}
                </Table.Cell>
                <Table.Cell>{blog.user_id}</Table.Cell>
                <Table.Cell>
                  <ToggleSwitch
                    checked={blog.is_active}
                    sizing={'sm'}
                    className="w-fit mx-auto"
                    onChange={() => {
                      setActive(!blog.is_active);
                      handleUpdateActiveBlog(blog.id!, !blog.is_active);
                    }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-center gap-2">
                    <button
                      className="bg-util shadow py-1.5 px-3 rounded-md"
                      onClick={() => {
                        swal({
                          title: "Bạn có muốn xóa bài viết này ?",
                          text: "Sau khi xóa sẽ không thể không phục !",
                          icon: "warning",
                          buttons: true,
                          dangerMode: true,
                        }).then((willDelete) => {
                          if (willDelete) {
                            handleRemoveBlo(blog.id!);
                            swal("Xóa bài viết thành công !", {
                              icon: "success",
                            });
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
                    <Link
                      to={`${blog.id}`}
                      className="bg-util shadow py-1.5 px-3 rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="#1B95F2"
                        className="size-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                    </Link>
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ListBlogsAdmin;
