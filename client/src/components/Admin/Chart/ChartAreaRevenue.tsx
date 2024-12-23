import React, { useState, useMemo, useEffect } from "react";
import Chart from "react-apexcharts";
import type { ChartOptions, ChartSeries } from "./types";
import instance from "../../../instance/instance";
import { ConfigProvider, DatePicker } from "antd";
import dayjs from "dayjs";

type TimelinePeriod =
  | "one_day"
  | "one_week"
  | "one_month"
  | "six_months"
  | "one_year"
  | "all";

interface TimelineButton {
  label: string;
  value: TimelinePeriod;
  startDate: string;
  endDate: string;
}

const ChartAreaRevenue: React.FC = () => {
  const [dataDateFilter, setDataDateFilter] = useState<TimelineButton[]>([]);
  const [allData, setAllData] = useState<string[][]>([]); // Tất cả dữ liệu nhận từ server
  const [filteredData, setFilteredData] = useState<string[][]>([]); // Dữ liệu đã lọc theo năm
  const [year, setYear] = useState<number>(new Date().getFullYear()); // Năm hiện tại
  const [selection, setSelection] = useState<TimelinePeriod>("one_month");

  // Lấy dữ liệu cho các nút bộ lọc ngày
  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("thong-ke/ngay-thong-ke");
        setDataDateFilter(data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // Lấy dữ liệu doanh thu và lưu tất cả dữ liệu lại
  useEffect(() => {
    (async () => {
      try {
        const {
          data: { data: response },
        } = await instance.get("thong-ke/doanh-thu");
        setAllData(response); // Lưu toàn bộ dữ liệu
        filterDataByYear(response, year); // Lọc dữ liệu theo năm mặc định (năm hiện tại)
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // Lọc dữ liệu doanh thu theo năm
  const filterDataByYear = (data: string[][], selectedYear: number) => {
    const filtered = data.filter(([timestamp]) => {
      const date = new Date(Number(timestamp));
      return date.getFullYear() === selectedYear;
    });
    setFilteredData(filtered);
  };

  // Định dạng số
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  // Dữ liệu của biểu đồ
  const chartSeries: ChartSeries[] = [
    {
      name: "Đơn hàng",
      data: filteredData.map(([timestamp, value]) => [
        Number(timestamp) + 7 * 60 * 60 * 1000, // GMT+7
        value,
      ]),
    },
  ];

  // Cài đặt biểu đồ
  const chartOptions: ChartOptions = useMemo(() => {
    const selectedTimeline = dataDateFilter.find(
      (btn) => btn.value === selection
    );

    return {
      chart: {
        id: "area-datetime",
        type: "area",
        height: 350,
        zoom: {
          autoScaleYaxis: true,
        },
        toolbar: {
          export: {
            csv: {
              filename: "bieu_do_doanh_thu",
              columnDelimiter: ",",
              headerCategory: "Ngày",
              headerValue: "value",
            },
            svg: {
              filename: undefined,
            },
            png: {
              filename: undefined,
            },
          },
        },
      },
      title: {
        text: `BIỂU ĐỒ THỐNG KÊ DOANH THU NĂM ${year}`,
      },
      colors: ["#ff9900"],
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
        style: "hollow",
      },
      xaxis: {
        type: "datetime",
        min: selectedTimeline
          ? new Date(selectedTimeline.startDate).getTime()
          : undefined,
        max: selectedTimeline
          ? new Date(selectedTimeline.endDate).getTime()
          : undefined,
        tickAmount: 6,
      },
      yaxis: {
        labels: {
          formatter: (value: number) => `${formatNumber(value)}`,
        },
        title: {
          text: "Giá trị (VNĐ)",
        },
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy",
        },
        y: {
          formatter: (value: number) => `${formatNumber(value)} VNĐ`,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
    };
  }, [selection, year, filteredData]);

  //Cập nhật khi người dùng chọn mốc thời gian
  const updateData = (timeline: TimelinePeriod): void => {
    setSelection(timeline);
  };

  // Xử lý khi người dùng chọn năm mới
  const handleYearChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const selectedYear = date.year();
      setYear(selectedYear);
      filterDataByYear(allData, selectedYear); // Lọc dữ liệu theo năm mới
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 col-span-8">
      <div className="mb-4 space-x-2">
        {dataDateFilter.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => updateData(value)}
            className={`px-3 py-1 rounded ${
              selection === value
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#ff9900",
            },
          }}
        >
          <DatePicker
            onChange={handleYearChange}
            picker="year"
            value={year ? dayjs(year.toString(), "YYYY") : null}
            className="ml-2"
          />
        </ConfigProvider>
      </div>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="area"
        height={350}
      />
    </div>
  );
};

export default ChartAreaRevenue;
