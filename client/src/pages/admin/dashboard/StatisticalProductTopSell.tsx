import { ConfigProvider, Table } from "antd";
import { IVariants } from "../../../interfaces/IVariants";
import type { TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { IProduct } from "../../../interfaces/IProduct";
import instance from "../../../instance/instance";
import { Link } from "react-router-dom";
interface ExpandedDataType {
  key: React.Key;
  variant: IVariants;
  total_revenue: number;
}

interface DataType {
  key: React.Key;
  name: string;
  total_revenue: number;
  image: string;
  variants: IVariants[];
  category: string;
  productName: string;
}
const listDate = [
  { label: "Ngày", value: "day" },
  { label: "Tuần", value: "week" },
  { label: "1 Tháng", value: "month" },
  { label: "6 Tháng", value: "6months" },
  { label: "Năm", value: "year" },
];
const StatisticalProductTopSell = () => {
  const [statisticalProduct, setStatisticalProducts] = useState<IProduct[]>([]);
  const [select, setSelect] = useState<string>("day");
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get(`thong-ke/san-pham?type=${select}`);
        setStatisticalProducts(data.top_selling_products);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [select]);
  const columns: TableColumnsType<DataType> = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
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
          <Link to={`/${record.category}/${record.productName}`} className="hover:text-primary">
            {record.name}
          </Link>
        </div>
      ),
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "total_revenue",
      key: "total_revenue",
      render: (_, record) => {
        return <div>{Number(record.total_revenue).toLocaleString()} VNĐ</div>;
      },
    },
  ];
  const dataSource = statisticalProduct.map<DataType>((product) => ({
    key: product.id!,
    name: product.name,
    total_revenue: product.total_revenue!,
    image: product.images[0],
    variants: product.variants,
    category: product?.category?.slug,
    productName: product.slug,
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
      })
    );

    return (
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#F4F7FA",
              colorLinkHover:"#ff9900",
              colorLink:"#ff9900"
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
    <div className="space-y-5">
      <h3 className="font-medium">TOP 10 SẢN PHẨM BÁN CHẠY</h3>
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
              setSelect(item.value);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#F4F7FA",
              colorLinkHover:"#ff9900",
              colorLink:"#ff9900"
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
  );
};

export default StatisticalProductTopSell;
