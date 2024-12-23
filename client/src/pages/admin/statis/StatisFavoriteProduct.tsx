import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { IProduct } from "../../../interfaces/IProduct";
import instance from "../../../instance/instance";
import { ConfigProvider, DatePicker } from "antd";
import { Link } from "react-router-dom";

const StatisFavoriteProduct = () => {
  const [favorites, setFavorites] = useState<IProduct[]>([]);
  const { RangePicker } = DatePicker;
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
  };
  useEffect(() => {
    (async () => {
      try {
        const fromDate = dateRange ? dateRange[0] : "";
        const toDate = dateRange ? dateRange[1] : "";
        const { data } = await instance.get(`thong-ke/top10-favorite?from_date=${fromDate}&to_date=${toDate}`);
        setFavorites(data.top_10_wishlist);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [dateRange]);
  return (
    <div className="space-y-6">
      <div className="w-fit mx-auto">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#ff9900",
            },
          }}
        >
          <RangePicker
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            onChange={handleDateChange}
          />
        </ConfigProvider>
      </div>
      <Table className="border-b border-[#E4E7EB]">
        <Table.Head className="text-center">
          <Table.HeadCell className="bg-[#F4F7FA] text-left text-secondary/75 text-sm font-medium capitalize text-nowrap">
            Sản phẩm
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {favorites.length === 0 ? (
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
                  <p>Không có sản phẩm nào</p>
                </div>
              </Table.Cell>
            </Table.Row>
          ) : (
            favorites.map((favorite, index) => {
              return (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
                  key={index + 1}
                >
                  <Table.Cell className="font-medium text-primary text-base border-[#f5f5f5] border-r ">
                    <div
                      style={{ display: "flex", alignItems: "center" }}
                      className="max-w-[350px] w-full"
                    >
                      <img
                        src={favorite?.images[0]}
                        alt={favorite?.name}
                        style={{
                          width: 45,
                          height: 45,
                          marginRight: 10,
                          objectFit: "cover",
                        }}
                        className="rounded-md"
                      />
                      <div className="max-w-[250px] text-sm text-secondary font-[400]">
                        <p className="text-ellipsis overflow-hidden text-nowrap">
                            {favorite.name}
                        </p>
                        <p className="text-left text-secondary/50">Số lượt thích: <span className="text-primary">{favorite?.favorites_count}</span></p>
                      </div>
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

export default StatisFavoriteProduct;
