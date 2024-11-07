import { useEffect, useState } from "react";
import instance from "../../../../instance/instance";
import { IUser } from "../../../../interfaces/IUser";
import { IProduct } from "../../../../interfaces/IProduct";
import { Avatar } from "@mui/material";
import { Rate } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { IAttributeValue } from "../../../../interfaces/IAttributeValue";

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

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("reviews/reviewed-orders");
        setRatingDoneLists(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  console.log(ratingDoneLists);

  return (
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
                      <p className="text-sm text-secondary/50 line-clamp-4">
                        Không có nội dung đánh giá
                      </p>
                    ) : (
                      <p className="text-sm text-secondary/50 line-clamp-4">
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
                        to=""
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
  );
};

export default UserRatingsDone;
