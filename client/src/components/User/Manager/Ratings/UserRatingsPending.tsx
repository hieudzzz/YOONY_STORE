import { ConfigProvider, Pagination } from "antd";
import { IOrderUserClient } from "../../../../interfaces/IOrderUserClient";
import { Link, NavLink } from "react-router-dom";
import { IMeta } from "../../../../interfaces/IMeta";
type Props = {
  listRatingsPending: IOrderUserClient[];
  meta: IMeta;
  page: number;
  setSearchParams: (params: Record<string, string | number | boolean>) => void;
};
const UserRatingsPending = ({
  listRatingsPending,
  meta,
  page,
  setSearchParams,
}: Props) => {
  return (
    <div className="space-y-5">
      <div className="max-w-[500px] w-full bg-util">
        <div className="space-y-3">
          {listRatingsPending &&
            listRatingsPending?.map((ratingPending) => {
              return (
                <div className="border border-[#f1f1f1] rounded-md p-3 flex justify-between">
                  <div className="flex gap-3 items-center w-fit">
                    <img
                      src={
                        ratingPending.items[0].variant.image ||
                        ratingPending.items[0].variant.product.images[0]
                      }
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div className="flex flex-col justify-between gap-1">
                      <p className="text-xs text-primary font-medium">
                        <span className="bg-primary/5 py-1 px-1.5 rounded-sm">
                          #{ratingPending.code}
                        </span>
                      </p>
                      <Link
                        to={`/${ratingPending.items[0].variant.product.category?.slug}/${ratingPending.items[0].variant.product.slug}`}
                        className="line-clamp-1 hover:text-primary"
                      >
                        {ratingPending.items[0].variant.product.name}
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <NavLink
                      to={`rating-detail/${ratingPending.code}`}
                      end
                      className="py-1 px-3 bg-primary text-util rounded-md hover:text-util"
                    >
                      <p className="text-nowrap">Đánh giá ngay</p>
                    </NavLink>
                  </div>
                </div>
              );
            })}
        </div>
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

export default UserRatingsPending;
