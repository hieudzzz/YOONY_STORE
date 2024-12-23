import { ConfigProvider, DatePicker, Pagination, Table } from "antd";
import { IVariants } from "../../../interfaces/IVariants";
import type { TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { IProduct } from "../../../interfaces/IProduct";
import instance from "../../../instance/instance";
import { Link, useSearchParams } from "react-router-dom";
import slugify from "react-slugify";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
import { IMeta } from "../../../interfaces/IMeta";
import StatisFavoriteProduct from "./StatisFavoriteProduct";
interface ExpandedDataType {
  key: React.Key;
  variant: IVariants;
  total_revenue: number;
  total_quantity_sold: number;
  stock_quantity: number;
}

interface DataType {
  key: React.Key;
  name: string;
  total_revenue: number;
  image: string;
  variants: IVariants[];
  category: string;
  total_quantity_sold: number;
  productName: string;
  total_stock_quantity: number;
  average_rating: number;
}
const listDate = [
  { label: "Ngày", value: "day" },
  { label: "Tuần", value: "week" },
  { label: "1 Tháng", value: "month" },
  { label: "6 Tháng", value: "6months" },
  { label: "Năm", value: "year" },
];
interface APIParams {
  type?: string;
  from_date?: string;
  to_date?: string;
  page: number;
}
const fetchStatisticalData = async (params: APIParams) => {
  const queryParams = new URLSearchParams();

  // Dynamic add params
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value.toString());
  });

  const url = `thong-ke/all-san-pham?${queryParams.toString()}`;
  return await instance.get(url);
};

const StatisProductAdmin = () => {
  const [statisticalProduct, setStatisticalProducts] = useState<IProduct[]>([]);
  const [select, setSelect] = useState<string>("day");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [meta, setMeta] = useState<IMeta>();
  const [dateRangeProduct, setDateRangeProduct] = useState<
    [string, string] | null
  >(null);

  const { RangePicker } = DatePicker;

  const handleDateChangeProduct = (
    dates: any,
    dateStringProducts: [string, string]
  ) => {
    setDateRangeProduct(dateStringProducts);
    setSelect("");
  };

  const handleSelectClick = (value: string) => {
    setSelect(value);
    setDateRangeProduct(null); // Reset date range khi chọn select
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setSearchParams({ page: String(page) });
        const params: APIParams = { page };
        if (dateRangeProduct) {
          params.from_date = dateRangeProduct[0];
          params.to_date = dateRangeProduct[1];
          setSelect("");
        } else if (select) {
          params.type = select;
        }
        const { data } = await fetchStatisticalData(params);
        setMeta(data);
        setStatisticalProducts(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [select, dateRangeProduct, page]);

  const columns: TableColumnsType<DataType> = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div
          style={{ display: "flex", alignItems: "center" }}
          className="max-w-[350px] w-full"
        >
          <img
            src={record.image}
            alt={record.name}
            style={{
              width: 45,
              height: 45,
              marginRight: 10,
              objectFit: "cover",
            }}
            className="rounded-md"
          />
          <div className="w-full max-w-[350px]">
            <p className="text-ellipsis overflow-hidden text-nowrap">
              <Link
                to={`/${record.category}/${record.productName}`}
                className="hover:text-primary"
              >
                {record.name}
              </Link>
            </p>
            <div className="flex gap-2 text-secondary/50">
              <p>SL đã bán: {record.total_quantity_sold}</p>
              <p className="text-primary">
                SL tồn kho: {record.total_stock_quantity}
              </p>
              <p className="flex gap-1.5 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-3"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {record.average_rating} / 5
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "total_revenue",
      align: "center",
      key: "total_revenue",
      render: (_, record) => {
        return <div>{Number(record.total_revenue).toLocaleString()} VNĐ</div>;
      },
    },
    {
      title: "Chi tiết",
      align: "center",
      key: "detail",
      render: (_, record) => {
        return (
          <div>
            <Link
              to={`/admin/thong-ke/san-pham/${slugify(record.name)}`}
              className="text-primary hover:text-primary/80 flex gap-2 justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-5"
                color={"currentColor"}
                fill={"none"}
              >
                <path
                  d="M4.94436 8.04069L10.8282 8.04069M2 18L7.49762 12.5862C7.70914 12.3779 8.03957 12.3544 8.27806 12.5308L12.5239 15.6712C12.774 15.8563 13.1229 15.8204 13.3306 15.5883L21.2849 6.70262M18.1084 6H20.9306C21.4785 6 21.9259 6.44077 21.9371 6.99179L22 10.0649"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Thống kê
            </Link>
          </div>
        );
      },
    },
  ];
  const dataSource = statisticalProduct?.map<DataType>((product) => ({
    key: product.id!,
    name: product.name,
    total_revenue: product.total_revenue!,
    image: product.images[0],
    variants: product.variants,
    category: product?.category?.slug,
    productName: product.slug,
    total_quantity_sold: product?.total_quantity_sold,
    total_stock_quantity: product?.total_stock_quantity,
    average_rating: product?.average_rating,
  }));

  const expandedRowRender = (record: DataType) => {
    const expandColumns: TableColumnsType<ExpandedDataType> = [
      {
        dataIndex: "variant",
        key: "variant",
        render: (variant: IVariants) => (
          <p className="text-secondary/50 text-xs line-clamp-1">
            Phân loại:{" "}
            {variant.attribute_values.map((attr) => attr.value).join(" , ")}
          </p>
        ),
      },
      {
        dataIndex: "stock_quantity",
        key: "stock_quantity",
        render: (_, record) => (
          <p className="text-secondary/50 text-xs line-clamp-1 text-primary">
            SL tồn kho: {record.stock_quantity}
          </p>
        ),
      },
      {
        dataIndex: "total_quantity_sold",
        key: "total_quantity_sold",
        render: (_, record) => (
          <p className="text-secondary/50 text-xs">
            SL đã bán: {record.total_quantity_sold || 0}
          </p>
        ),
      },
      {
        dataIndex: "total_revenue",
        key: "total_revenue",
        render: (_, record) => (
          <p className="text-secondary/50 text-xs line-clamp-1">
            {record.total_revenue
              ? Number(record.total_revenue).toLocaleString()
              : 0}{" "}
            VNĐ
          </p>
        ),
      },
    ];

    const expandDataSource = record.variants.map<ExpandedDataType>(
      (variant) => ({
        key: variant.id!,
        variant,
        total_revenue: variant.total_revenue!,
        stock_quantity: variant.stock_quantity,
        total_quantity_sold: variant.total_quantity_sold,
      })
    );

    return (
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#F4F7FA",
              colorLinkHover: "#ff9900",
              colorLink: "#ff9900",
            },
          },
        }}
      >
        <Table<ExpandedDataType>
          columns={expandColumns}
          dataSource={expandDataSource}
          pagination={false}
          size="middle"
          showHeader={false}
          className="py-2.5 px-2"
          rowHoverable={false}
        />
      </ConfigProvider>
    );
  };

  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text="Đang load dữ liệu ..."
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
    >
      <div className="p-5 rounded-md bg-util min-h-fit grid grid-cols-12 gap-5">
        <div className="space-y-5 col-span-8">
          <div className="overflow-auto border-b border-[#f1f1f1] space-y-5">
            <h3 className="font-medium">TOP SẢN PHẨM BÁN CHẠY</h3>
            <div className="flex gap-3 items-center">
              <div className="flex flex-wrap h-fit gap-3 text-secondary/75">
                {listDate.map((item) => (
                  <button
                    type="button"
                    key={item.label}
                    className={`${
                      select === item.value
                        ? "text-util bg-primary"
                        : "bg-[#F3F4F6] text-secondary"
                    } px-5 py-1.5 rounded-sm transition-all`}
                    onClick={() => {
                      handleSelectClick(item.value);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#ff9900",
                    },
                  }}
                >
                  <RangePicker
                    placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                    onChange={handleDateChangeProduct}
                  />
                </ConfigProvider>
              </div>
            </div>
            <ConfigProvider
              theme={{
                components: {
                  Table: {
                    headerBg: "#F4F7FA",
                    colorLinkHover: "#ff9900",
                    colorLink: "#ff9900",
                  },
                },
              }}
            >
              <Table<DataType>
                columns={columns}
                expandable={{ expandedRowRender }}
                dataSource={dataSource}
                size="middle"
                pagination={false}
                rowHoverable={false}
              />
            </ConfigProvider>
          </div>
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
        <div className="space-y-5 col-span-4">
          <h3 className="font-medium text-center">TOP 10 SẢN PHẨM YÊU THÍCH</h3>
          <StatisFavoriteProduct />
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default StatisProductAdmin;
