import { Tabs, ConfigProvider } from "antd";
import type { TabsProps } from "antd";
import UserRatingsPending from "./UserRatingsPending";
import UserRatingsDone from "./UserRatingsDone";
import { useEffect, useState } from "react";
import { IOrderUserClient } from "../../../../interfaces/IOrderUserClient";
import instance from "../../../../instance/instance";
import { IMeta } from "../../../../interfaces/IMeta";
import { useSearchParams } from "react-router-dom";

const UserRatings = () => {
  const [listRatingsPending, setListRatingsPending] = useState<IOrderUserClient[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  useEffect(() => {
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const {data} = await instance.get(`orders/pending-reviews?page=${page}`);
        setListRatingsPending(data.data);
        setMeta(data?.pagination);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [page]);
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: <p>Chưa đánh giá <span className="bg-primary py-0.5 px-1.5 text-xs text-util rounded-full">{listRatingsPending.length}</span></p>,
      children: <UserRatingsPending listRatingsPending={listRatingsPending} meta={meta} setSearchParams={setSearchParams} page={page} />,
    },
    {
      key: "2",
      label: "Đã đánh giá",
      children: <UserRatingsDone />,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            inkBarColor: "#ff9900",
            itemSelectedColor: "#ff9900",
            itemHoverColor: "#ff9900",
          },
        },
      }}
    >
      <div className="bg-util border border-[#f1f1f1] rounded-md px-4 pb-4 min-h-screen">
        <Tabs defaultActiveKey="1" items={items} className="rating-user" />
      </div>
    </ConfigProvider>
  );
};

export default UserRatings;
