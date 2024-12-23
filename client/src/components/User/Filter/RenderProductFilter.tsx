import { Pagination } from "antd";
import { IMeta } from "../../../interfaces/IMeta";
import { IProduct } from "../../../interfaces/IProduct";
import CardProductAll from "../Products/CardProductAll";
import GroupVariantsByColor from "../Show/GroupVariantsByColor";
import { useEffect, useState } from "react";

type Props = {
  datas: IProduct[];
  meta: IMeta;
  page: number;
  setSearchParams: (params: Record<string, string | number | boolean>) => void;
  parsedFilter:string
};
const RenderProductFilter = ({ datas, meta, page, setSearchParams,parsedFilter }: Props) => {
  const [productFilter, setProductFilter] = useState<string>("new");
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>(datas);
  // const handleSortPrice = async (status: string) => {
  //   try {
  //     const { data:{data:response} } = await instance.post(
  //       `products/filter?sort_price=${status}`
  //     );
  //     setFilteredProducts(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (parsedFilter) {
      setProductFilter(parsedFilter);
    }
  }, [parsedFilter]);

  useEffect(() => {
    let result = [...datas];

    switch (productFilter) {
      case "new":
        // Sắp xếp theo sản phẩm mới nhất
        result.sort(
          (a, b) =>
            new Date(b?.created_at || 0).getTime() -
            new Date(a?.created_at || 0).getTime()
        );
        break;
      case "feature":
        // Lọc sản phẩm nổi bật
        result = result.filter((item) => item.is_featured === true);
        break;
      case "asc":
        // Sắp xếp giá tăng dần
        result.sort((a, b) => {
          const minPriceA = Math.min(
            ...a.variants.map((variant) => variant.price || 0)
          );
          const minPriceB = Math.min(
            ...b.variants.map((variant) => variant.price || 0)
          );
          return minPriceA - minPriceB;
        });
        break;
      case "desc":
        // Sắp xếp giá giảm dần
        result.sort((a, b) => {
          const minPriceA = Math.min(
            ...a.variants.map((variant) => variant.price || 0)
          );
          const minPriceB = Math.min(
            ...b.variants.map((variant) => variant.price || 0)
          );
          return minPriceB - minPriceA;
        });
        break;
    }

    setFilteredProducts(result);
  }, [datas, productFilter,parsedFilter]);
  // Danh sách các nút lọc
  const filterButtons = [
    { key: "new", label: "Mới nhất" },
    { key: "feature", label: "Nổi bật" },
    { key: "asc", label: "Giá từ thấp đến cao" },
    { key: "desc", label: "Giá từ cao đến thấp" },
  ];
  // const items: MenuProps["items"] = [
  //   {
  //     key: "new",
  //     label: "Mới nhất",
  //     onClick: () => setProductFilter("new"),
  //   },
  //   {
  //     key: "feature",
  //     label: "Nổi bật",
  //     onClick: () => setProductFilter("feature"),
  //   },
  //   {
  //     key: "asc",
  //     label: "Giá từ thấp đến cao",
  //     onClick: () => setProductFilter("asc"),// giá tăng dần
  //   },
  //   {
  //     key: "desc",
  //     label: "Giá từ cao đến thấp",
  //     onClick: () => setProductFilter("desc"), // giá giảm dần
  //   },
  // ];
  return (
    <div className="space-y-5">
      <div className="flex gap-3 items-center">
        {filterButtons.map((button) => (
          <button
            key={button.key}
            className={`
                ${
                  productFilter === button.key
                    ? "bg-primary text-white"
                    : "bg-util border border-[#fcf1eb] text-secondary"
                }
                px-4 py-1.5 rounded-sm text-sm
              `}
            onClick={() => setProductFilter(button.key)}
          >
            {button.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4 min-h-[90vh]">
        {filteredProducts.map((data) => {
          const colorVariantsImages = GroupVariantsByColor(data?.variants);
          return (
            <div key={data?.id}>
              <CardProductAll
                imageProduct={data?.images[0]}
                nameProduct={data?.name}
                colorVariantsImages={colorVariantsImages as []}
                variants={data?.variants ?? []}
                is_featured={data?.is_featured === 1 ? true : false}
                is_good_deal={data?.is_good_deal === 1 ? true : false}
                id_Product={data?.id as number}
                category={data?.category?.slug as string}
              />
            </div>
          );
        })}
      </div>
      <div className="ml-auto">
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
    </div>
  );
};

export default RenderProductFilter;
