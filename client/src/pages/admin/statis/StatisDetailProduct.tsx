import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../../../instance/instance";
import ReactApexChart from "react-apexcharts";
import Chart from "react-apexcharts";
import { ConfigProvider, DatePicker } from "antd";
import { IProduct } from "../../../interfaces/IProduct";
import dayjs from "dayjs";
import RatingProduct from "../../../components/User/Show/RatingProduct";
const StatisDetailProduct = () => {
  const { RangePicker } = DatePicker;

  const { slug } = useParams();
  const [productData, setProductData] = useState<IProduct>();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const fromDate = dateRange ? dateRange[0] : "";
        const toDate = dateRange ? dateRange[1] : "";
        const {
          data: { data: response },
        } = await instance.get(
          `thong-ke/mot-san-pham/${slug}?from_date=${fromDate}&to_date=${toDate}`
        );
        setProductData(response);
      } catch (error) {
        console.error("Error fetching product data", error);
      }
    };
    fetchProductData();
  }, [slug, dateRange]);

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
  };

  const series = [
    {
      name: "SL huỷ",
      data: productData?.variants.map(
        (variant) => variant?.canceled_quantity || 0
      ),
    },
    {
      name: "Tổng doanh thu (VND)",
      data: productData?.variants.map((variant) =>
        variant.total_revenue ? parseInt(variant?.total_revenue) : 0
      ),
    },
    {
      name: "Số lượng đã bán",
      data: productData?.variants.map((variant) =>
        variant.total_quantity_sold ? parseInt(variant?.total_quantity_sold) : 0
      ),
    },
    {
      name: "Số lượng tồn kho",
      data: productData?.variants.map((variant) =>
        variant.stock_quantity ? parseInt(variant?.stock_quantity) : 0
      ),
    },
  ];
  const categories: string[] = productData?.variants.map((variant) =>
    variant.attribute_values.map((attr) => attr.value).join(" - ")
  );

  const chartData = {
    series: series,
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: false,
        toolbar: {
          show: true,
        },
      },
      colors: ["#F05152", "#22c55e", "#f97316", "#eab308"],
      plotOptions: {
        bar: {
          borderRadius: 8,
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 3,
        colors: ["transparent"],
      },
      xaxis: {
        categories: categories,
      },
      yaxis: {
        title: {
          text: "Giá trị",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: ["#FF9900", "#4ade80", "#fb923c", "#facc15"],
          stops: [0, 100],
        },
      },
      tooltip: {
        y: {
          formatter: function (val, { seriesIndex }) {
            if (seriesIndex === 1) {
              return val.toLocaleString() + " VND/Units";
            }
            return val.toLocaleString();
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
    },
  };

  const seriesProduct = [
    Number(productData?.total_quantity_sold),
    Number(productData?.stock_quantity),
  ];

  const optionsProduct = {
    series: seriesProduct,
    chart: {
      width: 320,
      type: "pie",
    },
    labels: ["Đã bán", "Tồn kho"], // Các nhãn xuất hiện dưới dạng legend
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 100,
          },
          legend: {
            position: "bottom", // Đặt legend bên dưới
          },
        },
      },
    ],
    colors: ["#0088FE", "#00C49F"],
    legend: {
      position: "bottom",
      horizontalAlign: "center", // Căn giữa các label
      fontSize: "14px", // Kích thước font chữ
      labels: {
        colors: "#000", // Màu của label
      },
    },
  };
  return (
    <div className="p-5 rounded-md min-h-screen bg-util space-y-5">
      <div className="grid grid-cols-12 gap-5">
        <div className="p-4 col-span-8 space-y-5">
          <h2 className="text-xl font-bold text-center mb-4">
            {productData?.name}
          </h2>
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
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={350}
          />
        </div>
        <div className="col-span-4 border border-[#f1f1f1] rounded-md p-4 space-y-5">
          <h3 className="font-medium">Thông tin sản phẩm</h3>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex items-center gap-2">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-6"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M12 22C11.1818 22 10.4002 21.6708 8.83693 21.0123C4.94564 19.3734 3 18.5539 3 17.1754V7.54234M12 22C12.8182 22 13.5998 21.6708 15.1631 21.0123C19.0544 19.3734 21 18.5539 21 17.1754V7.54234M12 22V12.0292M21 7.54234C21 8.15478 20.1984 8.54152 18.5953 9.315L15.6741 10.7244C13.8712 11.5943 12.9697 12.0292 12 12.0292M21 7.54234C21 6.9299 20.1984 6.54316 18.5953 5.76969L17 5M3 7.54234C3 8.15478 3.80157 8.54152 5.40472 9.315L8.32592 10.7244C10.1288 11.5943 11.0303 12.0292 12 12.0292M3 7.54234C3 6.9299 3.80157 6.54317 5.40472 5.76969L7 5M6 13.0263L8 14.0234"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 2L12 4M12 4L14 6M12 4L10 6M12 4L14 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div className="flex flex-col">
                <label className="text-sm text-secondary/50">SL đã huỷ</label>
                <p className="text-red-500">{productData?.canceled_quantity}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-5"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M3.06164 15.1933L3.42688 13.1219C3.85856 10.6736 4.0744 9.44952 4.92914 8.72476C5.78389 8 7.01171 8 9.46734 8H14.5327C16.9883 8 18.2161 8 19.0709 8.72476C19.9256 9.44952 20.1414 10.6736 20.5731 13.1219L20.9384 15.1933C21.5357 18.5811 21.8344 20.275 20.9147 21.3875C19.995 22.5 18.2959 22.5 14.8979 22.5H9.1021C5.70406 22.5 4.00504 22.5 3.08533 21.3875C2.16562 20.275 2.4643 18.5811 3.06164 15.1933Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7.5 8L7.66782 5.98618C7.85558 3.73306 9.73907 2 12 2C14.2609 2 16.1444 3.73306 16.3322 5.98618L16.5 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M15 11C14.87 12.4131 13.5657 13.5 12 13.5C10.4343 13.5 9.13002 12.4131 9 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div className="flex flex-col">
                <label className="text-sm text-secondary/50">Đã bán</label>
                <p>{productData?.total_quantity_sold}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-5"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M12 22C11.1818 22 10.4002 21.6698 8.83693 21.0095C4.94564 19.3657 3 18.5438 3 17.1613C3 16.7742 3 10.0645 3 7M12 22C12.8182 22 13.5998 21.6698 15.1631 21.0095C19.0544 19.3657 21 18.5438 21 17.1613V7M12 22L12 11.3548"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.32592 9.69138L5.40472 8.27785C3.80157 7.5021 3 7.11423 3 6.5C3 5.88577 3.80157 5.4979 5.40472 4.72215L8.32592 3.30862C10.1288 2.43621 11.0303 2 12 2C12.9697 2 13.8712 2.4362 15.6741 3.30862L18.5953 4.72215C20.1984 5.4979 21 5.88577 21 6.5C21 7.11423 20.1984 7.5021 18.5953 8.27785L15.6741 9.69138C13.8712 10.5638 12.9697 11 12 11C11.0303 11 10.1288 10.5638 8.32592 9.69138Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 12L8 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 4L7 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="flex flex-col">
                <label className="text-sm text-secondary/50">Tồn kho</label>
                <p className="text-primary">{productData?.stock_quantity}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-5"
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
              </span>
              <div className="flex flex-col">
                <label className="text-sm text-secondary/50">Đánh giá</label>
                <p>{productData?.average_rating}/5</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-5"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M7 11.2947C12.284 1.44656 18.8635 1.333 21.4928 2.50724C22.667 5.1365 22.5534 11.716 12.7053 17C12.6031 16.4129 12.0352 14.8749 10.5801 13.4199C9.12512 11.9648 7.58712 11.3969 7 11.2947Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 16.8C16.0428 17.7334 16.2609 19.4069 16.5439 21C16.5439 21 20.8223 18.0481 18.0856 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.19998 9.99987C6.26664 7.95709 4.59305 7.73899 3 7.45601C3 7.45601 5.95194 3.17753 10 5.91431"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.20866 13.9998C5.57677 14.6317 4.50255 16.4642 5.26082 18.739C7.53564 19.4973 9.36813 18.4231 10 17.7912"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.0952 7.753C18.0952 6.7328 17.2682 5.90578 16.248 5.90578C15.2278 5.90578 14.4008 6.7328 14.4008 7.753C14.4008 8.77319 15.2278 9.60022 16.248 9.60022C17.2682 9.60022 18.0952 8.77319 18.0952 7.753Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>
              <div className="flex flex-col">
                <label className="text-sm text-secondary/50">
                  Tổng doanh thu
                </label>
                <p>{productData?.total_revenue.toLocaleString()}đ</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-5"
                  color={"currentColor"}
                  fill={"none"}
                >
                  <path
                    d="M18 2V4M6 2V4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.9955 13H12.0045M11.9955 17H12.0045M15.991 13H16M8 13H8.00897M8 17H8.00897"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.5 8H20.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 8H21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="flex flex-col">
                <label className="text-sm text-secondary/50">Ngày tạo</label>
                <p>{dayjs(productData?.created_at).format("DD/MM/YYYY")}</p>
              </div>
            </div>
          </div>
          <Chart
            options={optionsProduct}
            series={optionsProduct.series}
            type="pie"
            width={optionsProduct.chart.width}
          />
        </div>
      </div>
      <RatingProduct slugProd={productData?.slug} />
    </div>
  );
};

export default StatisDetailProduct;
