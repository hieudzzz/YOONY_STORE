import { Checkbox, ConfigProvider, Rate, Slider, Tag } from "antd";
import type { GetProp } from "antd";
import { useCallback, useEffect, useState } from "react";
import instance from "../../../instance/instance";
import { ICategory } from "../../../interfaces/ICategory";
import { IAttribute } from "../../../interfaces/IAttribute";
import queryString from "query-string";
import { useLocation, useSearchParams } from "react-router-dom";
import { IProduct } from "../../../interfaces/IProduct";
import { debounce } from "lodash";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
import RenderProductFilter from "./RenderProductFilter";
import { IMeta } from "../../../interfaces/IMeta";

interface IPrice {
  min: number;
  max: number;
}

export interface IFilterResponse {
  categories: ICategory[];
  attributes: IAttribute[];
  price: IPrice;
}

interface IAttributeFilters {
  [key: string]: string[];
}

export interface IFilterParams {
  name?: string;
  category_id?: number[];
  attributes?: IAttributeFilters;
  price?: [number, number];
  rate: number;
}

const FilterProducts = () => {
  const [sliderValue, setSliderValue] = useState<
    [number, number] | undefined
  >();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>();
  const [selectedAttributes, setSelectedAttributes] =
    useState<IAttributeFilters>({});
  const [dataFilter, setDataFilter] = useState<IFilterResponse>();
  const [parsedSearch, setParsedSearch] = useState<any>();
  const [dataResponse, setDataResponse] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  const location = useLocation();

  const fetchProducts = useCallback(
    async (params: IFilterParams) => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        const cleanParams = {
          ...params,
          name: params.name || undefined,
          category_id: params.category_id?.length
            ? params.category_id
            : undefined,
          attributes: Object.keys(params.attributes || {}).length
            ? params.attributes
            : undefined,
          price: params.price?.every((val) => val !== undefined)
            ? params.price
            : undefined,
        };

        const currentPage = searchParams.get("page") || "1";
        setSearchParams({ 
          ...Object.fromEntries(searchParams), 
          page: currentPage 
        });
  
        const {
          data,
        } = await instance.post(`products/filter?page=${currentPage}`, cleanParams);
        setDataResponse(data.data);
        setMeta(data)
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [setDataResponse, setIsLoading, searchParams]
  );

  const debouncedFetchProducts = useCallback(debounce(fetchProducts, 500), [
    fetchProducts,
  ]);

  const handleFiltersChange = useCallback(() => {
    const params: IFilterParams = {
      rate: selectedRating!,
      name: parsedSearch?.q,
      category_id: selectedCategories,
      attributes: selectedAttributes,
      price: sliderValue,
    };

    debouncedFetchProducts(params, page);
  }, [
    parsedSearch?.q,
    selectedCategories,
    selectedAttributes,
    selectedRating,
    sliderValue,
    debouncedFetchProducts,
    page,
  ]);

  // Initial filter data fetch
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("products/filter");
        setDataFilter(data);
        // if (!sliderValue && data.price) {
        //   setSliderValue([data.price.min, data.price.max]);
        // }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [setDataFilter]);

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    setParsedSearch(parsed);
    if (parsed.category && dataFilter?.categories) {
      const categoryFromUrl = parsed.category;
      const matchedCategory = dataFilter.categories.find(
        (category) => category.slug === categoryFromUrl
      );
      
      if (matchedCategory) {
        setSelectedCategories([matchedCategory.id]);
      }
    }
  }, [location.search, setParsedSearch,dataFilter]);

  useEffect(() => {
    handleFiltersChange();
  }, [
    parsedSearch,
    selectedCategories,
    selectedAttributes,
    selectedRating,
    sliderValue,
    handleFiltersChange,
  ]);

  const onChangeCategories: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValueCategories
  ) => {
    const newCategories = checkedValueCategories as number[];
    setSelectedCategories(newCategories);
    handleFiltersChange();
  };

  const handleAttributeChange = (attributeName: string, values: string[]) => {
    setSelectedAttributes((prev) => {
      const newAttributes = { ...prev };
      if (values.length > 0) {
        newAttributes[attributeName] = values;
      } else {
        delete newAttributes[attributeName];
      }
      return newAttributes;
    });
    handleFiltersChange();
  };

  const handlePriceChange = (value: [number, number]) => {
    setSliderValue(value);
    handleFiltersChange();
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedAttributes({});
    setSelectedRating(undefined);
    // setSliderValue([dataFilter.price.min, dataFilter.price.max]);
    setSliderValue(undefined);
    handleFiltersChange();
  };

  const handleTagClose = (type: "category" | "attribute" | "price", value: number | string) => {
    switch (type) {
      case "category":
        // Xoá category đã chọn
        setSelectedCategories((prev) => prev.filter((cat) => cat !== value));
        break;
      case "attribute":
        // Xoá giá trị thuộc tính đã chọn
        setSelectedAttributes((prev) => {
          const newAttributes = { ...prev };
          Object.keys(newAttributes).forEach((key) => {
            newAttributes[key] = newAttributes[key].filter((val) => val !== value);
          });
          return newAttributes;
        });
        break;
      case "price":
        // Reset giá slider về giá trị mặc định
        setSliderValue([dataFilter?.price.min, dataFilter?.price.max] as any);
        break;
    }
  
    // Kiểm tra nếu không còn tag nào thì reset về mặc định
    const isAllTagsRemoved = !(
      selectedCategories.length ||
      Object.keys(selectedAttributes).length ||
      sliderValue
    );
  
    // Nếu tất cả các tag đều bị xoá, reset bộ lọc
    if (isAllTagsRemoved) {
      handleResetFilters();
    } else {
      handleFiltersChange(); // Nếu không phải tất cả tag bị xoá, chỉ cần cập nhật bộ lọc
    }
  };
  

  const selectedTags = [
    ...selectedCategories.map((catId) => ({
      type: "category",
      value: catId,
      label: dataFilter?.categories?.find((c) => c.id === catId)?.name,
    })),
    ...Object.entries(selectedAttributes).flatMap(([attrName, values]) =>
      values.map((val) => ({
        type: "attribute",
        value: val,
        label: val,
      }))
    ),
    ...(sliderValue
      ? [
          {
            type: "price",
            value: "price",
            label: `${sliderValue[0].toLocaleString()}đ - ${sliderValue[1].toLocaleString()}đ`,
          },
        ]
      : []),
  ];

  const categorieOptions = dataFilter?.categories?.map((categorie) => ({
    label: categorie.name,
    value: categorie.id,
  }));

  const handleRatingChange = (e: number) => {
    setSelectedRating(e);
  };

  return (
    <div className="my-5">
      <div>
        <h2 className="font-medium text-secondary/60">
          Kết quả tìm kiếm cho:{" "}
          <span className="text-primary">{parsedSearch?.q}</span>
        </h2>
      </div>
      <div className="my-5 bg-white grid grid-cols-9 gap-5">
        <div className="col-span-2 min-h-screen bg-util border border-[#f1f1f1] rounded-md p-4 space-y-5 sticky top-20">
          {/* Filter header */}
          <div className="space-y-3">
            <h3 className="font-medium text-[15px] flex items-center gap-1.5 justify-between">
              <span className="flex items-center gap-1.5">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-4"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M13.2426 17.5C13.1955 17.8033 13.1531 18.0485 13.1164 18.2442C12.8876 19.4657 11.1555 20.2006 10.2283 20.8563C9.67638 21.2466 9.00662 20.782 8.9351 20.1778C8.79875 19.0261 8.54193 16.6864 8.26159 13.2614C8.23641 12.9539 8.08718 12.6761 7.85978 12.5061C5.37133 10.6456 3.59796 8.59917 2.62966 7.44869C2.32992 7.09255 2.2317 6.83192 2.17265 6.37282C1.97043 4.80082 1.86933 4.01482 2.33027 3.50742C2.79122 3.00002 3.60636 3.00002 5.23665 3.00002H16.768C18.3983 3.00002 19.2134 3.00002 19.6743 3.50742C19.8979 3.75348 19.9892 4.06506 20.001 4.50002"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.8628 7.4392L21.5571 8.13157C22.1445 8.71735 22.1445 9.6671 21.5571 10.2529L17.9196 13.9486C17.6335 14.2339 17.2675 14.4263 16.8697 14.5003L14.6153 14.9884C14.2593 15.0655 13.9424 14.7503 14.0186 14.3951L14.4985 12.1598C14.5728 11.7631 14.7657 11.3981 15.0518 11.1128L18.7356 7.4392C19.323 6.85342 20.2754 6.85342 20.8628 7.4392Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Bộ lọc
              </span>
              <button
                onClick={handleResetFilters}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Đặt lại
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-4"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M16.9767 19.5C19.4017 17.8876 21 15.1305 21 12C21 7.02944 16.9706 3 12 3C11.3126 3 10.6432 3.07706 10 3.22302M16.9767 19.5V16M16.9767 19.5H20.5M7 4.51555C4.58803 6.13007 3 8.87958 3 12C3 16.9706 7.02944 21 12 21C12.6874 21 13.3568 20.9229 14 20.777M7 4.51555V8M7 4.51555H3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>
            {selectedTags.map((tag) => (
              <Tag
                key={`${tag.type}-${tag.value}`}
                color="orange"
                closable
                onClose={() => handleTagClose(tag.type, tag.value)}
              >
                {tag.label}
              </Tag>
            ))}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="font-medium text-[15px]">Danh mục</h3>
            <div className="text-sm text-secondary/75">
              <ConfigProvider theme={{ token: { colorPrimary: "#ff9900" } }}>
                <Checkbox.Group
                  value={selectedCategories}
                  options={categorieOptions}
                  onChange={onChangeCategories}
                  style={{ display: "flex", flexDirection: "column", gap: 5 }}
                />
              </ConfigProvider>
            </div>
          </div>

          {/* Price slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between w-full">
              <h3 className="font-medium">Giá</h3>
              <div className="text-sm text-secondary/75 flex items-center flex-wrap font-medium">
                <p className="whitespace-nowrap">
                  {sliderValue?.[0]?.toLocaleString()}đ
                </p>
                <span className="mx-1">-</span>
                <p className="whitespace-nowrap">
                  {sliderValue?.[1]?.toLocaleString()}đ
                </p>
              </div>
            </div>
            <div className="text-sm text-secondary/75">
              <ConfigProvider
                theme={{
                  components: {
                    Slider: {
                      trackBg: "#ff9900",
                      trackHoverBg: "#ffbc56",
                      handleColor: "#ff9900",
                      dotSize: 5,
                    },
                  },
                  token: { colorPrimary: "#ff9900" },
                }}
              >
                <Slider
                  range
                  min={dataFilter?.price?.min}
                  max={dataFilter?.price?.max}
                  value={sliderValue}
                  onChange={handlePriceChange}
                  tooltip={{
                    formatter: (value) =>
                      value !== undefined ? value.toLocaleString() : "",
                  }}
                />
              </ConfigProvider>
            </div>
          </div>
          {/* Attributes */}
          {dataFilter?.attributes?.map((attribute) => {
            const attributeOptions = attribute?.attribute_values?.map(
              (attribute_value) => ({
                label:
                  attribute.slug === "color" ? (
                    <span className="flex items-center gap-1.5">
                      {attribute_value.value}{" "}
                      <span
                        className={`size-4 block border rounded-full`}
                        style={{
                          backgroundColor: attribute_value.value.toLowerCase(),
                        }}
                      ></span>
                    </span>
                  ) : (
                    attribute_value.value
                  ),
                value: attribute_value.value,
              })
            );
            return (
              attribute.attribute_values?.length !== 0 && (
                <div className="space-y-2" key={attribute.id}>
                  <h3 className="font-medium text-[15px]">{attribute.name}</h3>
                  <div className="text-sm text-secondary/75">
                    <ConfigProvider
                      theme={{ token: { colorPrimary: "#ff9900" } }}
                    >
                      <Checkbox.Group
                        options={attributeOptions}
                        value={selectedAttributes[attribute.name] || []}
                        onChange={(values) =>
                          handleAttributeChange(
                            attribute.name,
                            values as string[]
                          )
                        }
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 5,
                        }}
                      />
                    </ConfigProvider>
                  </div>
                </div>
              )
            );
          })}
          {/* Rate */}
          <div className="space-y-3">
            <h3 className="font-medium">Đánh giá số sao trở lên</h3>
            <Rate
              allowHalf
              className="rating-filter"
              onChange={handleRatingChange}
              value={selectedRating}
            />
          </div>
        </div>
        <div className="col-span-7 min-h-screen bg-util rounded-md">
          <LoadingOverlay
            active={isLoading}
            spinner
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
            className="flex justify-between items-center"
          >
            <RenderProductFilter
              datas={dataResponse}
              setSearchParams={setSearchParams}
              parsedFilter={parsedSearch?.filter}
              page={page}
              meta={meta!}
            />
          </LoadingOverlay>
        </div>
      </div>
    </div>
  );
};

export default FilterProducts;
