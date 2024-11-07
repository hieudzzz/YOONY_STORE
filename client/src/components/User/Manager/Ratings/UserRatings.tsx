import { Tabs, ConfigProvider } from "antd";
import type { TabsProps } from "antd";
import UserRatingsPending from "./UserRatingsPending";
import UserRatingsDone from "./UserRatingsDone";
import { useEffect, useState } from "react";
import { IOrderUserClient } from "../../../../interfaces/IOrderUserClient";
import instance from "../../../../instance/instance";

const UserRatings = () => {
  const [listRatingsPending, setListRatingsPending] = useState<IOrderUserClient[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("orders/pending-reviews");
        setListRatingsPending(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: <p>Chưa đánh giá <span className="bg-primary py-0.5 px-1.5 text-xs text-util rounded-full">{listRatingsPending.length}</span></p>,
      children: <UserRatingsPending listRatingsPending={listRatingsPending} />,
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
