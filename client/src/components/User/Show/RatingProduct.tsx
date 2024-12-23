import { Pagination, Rate } from "antd";
import { useEffect, useState } from "react";
import instance from "../../../instance/instance";
import { Avatar } from "@mui/material";
import dayjs from "dayjs";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";

type Prop = {
  slugProd: string | undefined;
};
type RatingCount = {
  key: string;
  value?: number;
};

type User = {
  name: string;
  avatar: string;
};

type Attribute = {
  id: number;
  name: string;
};

type AttributeValue = {
  id: number;
  value: string;
  attribute: Attribute;
};

type RatingData = {
  id: number;
  content: string | null;
  rating: number;
  created_at: string;
  user: User;
  attribute_values: AttributeValue[];
};

type Link = {
  url: string | null;
  label: string;
  active: boolean;
};

type RatePaginate = {
  current_page: number;
  data: RatingData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

type ProductRating = {
  average_rating: number;
  rating_counts: RatingCount[];
  rate_paginate8: RatePaginate;
};

const RatingProduct = ({ slugProd }: Prop) => {
  const [ratingDatas, setRatingDatas] = useState<ProductRating>();
  const [selectRating, setSelectRating] = useState<string>("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      try {
        setLoading(false);
        const { data } = await instance.get(
          `home/products/${slugProd}/ratings/?page=${currentPage}`
        );
        setRatingDatas(data.ratings);
        setLoading(false);
      } catch (error) {
        console.log(error)
      }
    })();
  }, [slugProd, currentPage]);
  if (!ratingDatas)
    return (
      <div>
        <LoadingOverlay
          active={isLoading}
          spinner
          text="Đang đăng nhập ..."
          styles={{
            overlay: (base) => ({
              ...base,
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(4px)",
            }),
            spinner: (base) => ({
              ...base,
              width: "40px",
              "& svg circle": {
                stroke: "rgba(255, 153, 0,5)",
                strokeWidth: "3px",
              },
            }),
          }}
        ></LoadingOverlay>
      </div>
    );
  return (
    <section className="bg-util border border-[#f1f1f1] rounded-md p-5 space-y-5">
      <h2 className="text-base md:text-xl font-medium uppercase flex items-center gap-2">
        ĐÁNH GIÁ SẢN PHẨM
      </h2>
      <div className="bg-primary/5 px-10 py-5 rounded-md flex gap-20 items-center border border-[#fcf1eb]">
        <div className="space-y-4">
          <div className="text-primary flex gap-2 items-end flex-wrap">
            <span className="text-3xl">{ratingDatas?.average_rating}</span>
            <span className="text-lg">trên 5</span>
          </div>
          <Rate
            disabled
            allowHalf
            value={ratingDatas?.average_rating || 0}
            className="rating-product-detail"
          />
        </div>
        <div className="flex flex-wrap h-fit gap-3 text-secondary/75">
          {ratingDatas?.rating_counts.map((rating_count) => (
            <button
              type="button"
              key={rating_count.key}
              className={`${
                selectRating === rating_count.key
                  ? "border border-primary text-util bg-primary"
                  : "border border-[#fcf1eb] text-secondary bg-util"
              } px-5 py-1.5 rounded-sm transition-all`}
              onClick={() => {
                setSelectRating(rating_count.key);
              }}
            >
              {rating_count.key !== "Tất cả"
                ? `${rating_count.key} sao (${rating_count.value})`
                : rating_count.key}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {ratingDatas?.rate_paginate8?.data.filter((itemRate) => {
          if (selectRating === "Tất cả") {
            return true;
          }
          return Number(itemRate.rating) === Number(selectRating);
        }).length === 0 ? (
          <div className="flex flex-col items-center text-secondary/20 space-y-2 justify-center min-h-[50vh]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M11.9955 12H12.0045M8 12H8.00897"
                stroke="currentColor"
              />
              <path
                d="M22 11.5667C22 16.8499 17.5222 21.1334 12 21.1334C11.3507 21.1343 10.7032 21.0742 10.0654 20.9545C9.60633 20.8682 9.37678 20.8251 9.21653 20.8496C9.05627 20.8741 8.82918 20.9949 8.37499 21.2364C7.09014 21.9197 5.59195 22.161 4.15111 21.893C4.69874 21.2194 5.07275 20.4112 5.23778 19.5448C5.33778 19.0148 5.09 18.5 4.71889 18.1231C3.03333 16.4115 2 14.1051 2 11.5667C2 6.28357 6.47778 2 12 2C12.6849 2 13.3538 2.0659 14 2.19142"
                stroke="currentColor"
              />
              <path
                d="M20.8386 2.47645L21.5309 3.16882C22.1167 3.7546 22.1167 4.70435 21.5309 5.29013L17.9035 8.9858C17.6182 9.27115 17.2532 9.46351 16.8565 9.53759L14.6084 10.0256C14.2534 10.1027 13.9373 9.78753 14.0134 9.43236L14.4919 7.19703C14.566 6.80035 14.7583 6.43535 15.0437 6.15L18.7173 2.47645C19.303 1.89066 20.2528 1.89066 20.8386 2.47645Z"
                stroke="currentColor"
              />
            </svg>
            <p>Không có đánh giá nào cho mức sao này.</p>
          </div>
        ) : (
          ratingDatas?.rate_paginate8?.data
            .filter((itemRate) => {
              if (selectRating === "Tất cả") {
                return true;
              }
              return Number(itemRate.rating) === Number(selectRating);
            })
            .map((item, index, array) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 py-4 ${
                  index !== array.length - 1
                    ? "border-b border-[#e9e9e9] border-dashed"
                    : ""
                }`}
              >
                <Avatar
                  alt={item.user.name}
                  src={item.user.avatar || "/default-avatar.png"}
                  sx={{ width: 36, height: 36 }}
                />
                <div className="space-y-2">
                  <div className="flex flex-col gap-0.5">
                    <p>{item.user.name}</p>
                    <Rate
                      disabled
                      defaultValue={item.rating}
                      className="rating-done text-[10px]"
                    />
                  </div>
                  <div className="text-xs text-secondary/50 flex items-center gap-2">
                    <span>
                      {dayjs(item.created_at).format("DD-MM-YYYY HH:mm")}{" "}
                    </span>{" "}
                    |
                    <p className="text-secondary/50 text-xs line-clamp-1">
                      Phân loại:{" "}
                      {item.attribute_values &&
                        Object.entries(
                          item.attribute_values.reduce<
                            Record<string, string[]>
                          >((acc, attr) => {
                            const attrName = attr.attribute.name;
                            const value = attr.value;
                            if (!acc[attrName]) {
                              acc[attrName] = [];
                            }
                            acc[attrName].push(value!);
                            return acc;
                          }, {})
                        )
                          .reduce<string[][]>((result, [key, values]) => {
                            if (values.length > 0) {
                              values.forEach((value, index) => {
                                if (!result[index]) {
                                  result[index] = [];
                                }
                                result[index].push(value);
                              });
                            }
                            return result;
                          }, [])
                          .map((group) => group.join(", "))
                          .join(" | ")}
                    </p>
                  </div>
                  <div className="bg-[#F6F6F6] p-2 rounded-sm">
                    {!item.content ? (
                      <p className="text-sm text-secondary/75 line-clamp-4">
                        Không có nội dung đánh giá
                      </p>
                    ) : (
                      <p className="text-sm text-secondary/75 line-clamp-4">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
      <div>
        <Pagination
          current={currentPage}
          total={ratingDatas?.rate_paginate8?.total || 0}
          pageSize={ratingDatas?.rate_paginate8?.per_page || 8}
          onChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({
              top: 850,
              behavior: "smooth",
            });
          }}
          align="end"
        />
      </div>
    </section>
  );
};

export default RatingProduct;
