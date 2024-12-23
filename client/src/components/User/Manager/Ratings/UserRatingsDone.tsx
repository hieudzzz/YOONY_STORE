import { useEffect, useState } from "react";
import instance from "../../../../instance/instance";
import { IUser } from "../../../../interfaces/IUser";
import { IProduct } from "../../../../interfaces/IProduct";
import { Avatar } from "@mui/material";
import { ConfigProvider, Pagination, Rate } from "antd";
import dayjs from "dayjs";
import { Link, useSearchParams } from "react-router-dom";
import { IAttributeValue } from "../../../../interfaces/IAttributeValue";
import { IMeta } from "../../../../interfaces/IMeta";

interface CartItem {
  id: number;
  variant_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  attribute_values: IAttributeValue[];
}

type IRatingDone = {
  items: CartItem[];
  order_id: number;
  rates: Review[];
};

type Review = {
  id: number;
  content: string | null;
  rating: number;
  product: IProduct;
  user: IUser;
  order_id: number;
  created_at: string;
  updated_at: string;
};

const UserRatingsDone = () => {
  const [ratingDoneLists, setRatingDoneLists] = useState<IRatingDone[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  useEffect(() => {
    (async () => {
      try {
        setSearchParams({ page: String(page) });
        const { data } = await instance.get(`reviews/reviewed-orders?page=${page}`);
        setRatingDoneLists(data.data);
        setMeta(data.pagination);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [page]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 max-h-screen overflow-y-auto rating-scroll-done pr-1">
        {ratingDoneLists &&
          ratingDoneLists.flatMap((rateDoneItem) =>
            rateDoneItem.rates.map((rate) => (
              <div
                key={rate.id}
                className="border border-[#f1f1f1] rounded-md p-3"
              >
                <div className="flex items-start gap-2">
                  <Avatar
                    alt={rate.user.name}
                    src={rate.user.avatar || "/default-avatar.png"}
                    sx={{ width: 32, height: 32 }}
                  />
                  <div className="space-y-2">
                    <div className="flex flex-col gap-0.5">
                      <p>{rate.user.name}</p>
                      <Rate
                        disabled
                        defaultValue={rate.rating}
                        className="rating-done text-[10px]"
                      />
                    </div>
                    <p className="text-xs text-secondary/50">
                      {dayjs(rate.created_at).format("DD-MM-YYYY HH:mm")}
                    </p>
                    <div className="bg-[#F6F6F6] p-2 rounded-sm">
                      {!rate.content ? (
                        <p className="text-sm text-secondary/75 line-clamp-4">
                          Không có nội dung đánh giá
                        </p>
                      ) : (
                        <p className="text-sm text-secondary/75 line-clamp-4">
                          {rate.content}
                        </p>
                      )}
                    </div>
                    {/* Product Information */}
                    <div className="flex gap-3 items-center w-fit bg-[#F6F6F6] p-2 rounded-sm">
                      <img
                        src={rate.product.images[0]}
                        className="max-w-10 h-10 object-cover rounded-md w-full"
                        alt={rate.product.name}
                      />
                      <div className="flex flex-col justify-between">
                        <Link
                          to={`/${rate.product.category?.slug}/${rate.product.slug}`}
                          className="line-clamp-1 hover:text-primary text-secondary/75"
                        >
                          {rate.product.name}
                        </Link>
                        <p className="text-secondary/50 text-xs line-clamp-1">
                          Phân loại:{" "}
                          {rateDoneItem.items
                            .map((item) =>
                              item.attribute_values
                                .map((attr) => attr.value)
                                .join(", ")
                            )
                            .join(" | ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
      </div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#ff9900",
          },
        }}
      >
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
      </ConfigProvider>
    </div>
  );
};

export default UserRatingsDone;
