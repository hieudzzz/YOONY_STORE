import { ConfigProvider, Pagination, Tabs, type TabsProps } from "antd";
import ListBlogsAdmin from "./ListBlogsAdmin";
import AddBlogAdmin from "./AddBlogAdmin";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IMeta } from "../../../interfaces/IMeta";

const BlogsAdmin = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  const [steps, setSteps] = useState<string>("1")
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Danh sách",
      children: <ListBlogsAdmin setMeta={setMeta} page={page} setSearchParams={setSearchParams} />,
    },
    {
      key: "2",
      label: "Thêm bài viết",
      children: <AddBlogAdmin setSteps={setSteps} />,
    },
  ];
  const handleTabChange = (key: string) => {
    setSteps(key);
  };
  return (
    <ConfigProvider
      theme={{
        token:{
          colorPrimary: "#ff9900",
        },
        components: {
          Tabs: {
            inkBarColor: "#ff9900",
            itemSelectedColor: "#ff9900",
            itemHoverColor: "#ff9900",
          },
        },
      }}
    >
      <div className="bg-util rounded-md px-4 pb-4 space-y-5">
        <Tabs activeKey={steps} onChange={handleTabChange} items={items} />
        <Pagination
          current={page}
          onChange={(page) => {
            setSearchParams({ page: String(page) });
          }}
          total={meta?.total || 0}
          pageSize={meta?.per_page || 10}
          showSizeChanger={false}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`
          }
          align="end"
        />
      </div>
    </ConfigProvider>
  );
};

export default BlogsAdmin;
