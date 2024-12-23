import React, { useState, useMemo, useEffect } from "react";
import Chart from "react-apexcharts";
import type { ChartOptions, ChartSeries } from "./types";
import instance from "../../../instance/instance";

type TimelinePeriod =
  | "one_day"
  | "one_week"
  | "one_month"
  | "six_months"
  | "one_year"
  | "last_year"
  | "all";

interface TimelineButton {
  label: string;
  value: TimelinePeriod;
  startDate: string;
  endDate: string;
}

const ChartAreaProfit: React.FC = () => {
  const [dataDateFilter, setDataDateFilter] = useState<TimelineButton[]>([]);
  const [data, setData] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch date filter options
  useEffect(() => {
    const fetchDateFilter = async () => {
      try {
        const { data } = await instance.get('thong-ke/ngay-thong-ke');
        setDataDateFilter(data);
      } catch (error) {
        console.error('Error fetching date filter:', error);
        setError('Không thể tải dữ liệu bộ lọc ngày');
      }
    };
    fetchDateFilter();
  }, []);

  // Fetch profit data
  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        setLoading(true);
        const { data: { data: response } } = await instance.get('thong-ke/profit');
        setData(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profit data:', error);
        setError('Không thể tải dữ liệu lợi nhuận');
        setLoading(false);
      }
    };
    fetchProfitData();
  }, []);

  // Format number with Vietnamese locale
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  // Separate profit and loss data
  const profitData = data
    .filter(([_, value]) => value >= 0)
    .map(([timestamp, value]) => [
      new Date(timestamp).getTime() + 7 * 60 * 60 * 1000,
      value
    ]);

  const lossData = data
    .filter(([_, value]) => value < 0)
    .map(([timestamp, value]) => [
      new Date(timestamp).getTime() + 7 * 60 * 60 * 1000,
      Math.abs(value)
    ]);

  // Chart series configuration
  const chartSeries: ChartSeries[] = [
    {
      name: "Lợi nhuận",
      data: profitData,
    },
    {
      name: "Lỗ",
      data: lossData,
    }
  ];

  // Timeline selection state
  const [selection, setSelection] = useState<TimelinePeriod>("one_month");

  // Chart options
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
              filename: "bieu_do_loi_nhuan",
              columnDelimiter: ",",
              headerCategory: "Ngày",
              headerValue: "Giá trị",
            },
            svg: { filename: undefined },
            png: { filename: undefined },
          },
        },
      },
      title: {
        text: "BIỂU ĐỒ THỐNG KÊ LỢI NHUẬN",
      },
      colors: ["#14D1B8", "#FF4560"],
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
          text: "Giá trị (VNĐ)"
        }
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
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left'
      },
      stroke: {
        curve: 'smooth',
        width: 2
      }
    };
  }, [selection, dataDateFilter]);

  // Update timeline selection
  const updateData = (timeline: TimelinePeriod): void => {
    setSelection(timeline);
  };

  // Loading and error handling
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-5 col-span-8 flex justify-center items-center">
        <div className="loader">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-5 col-span-8 text-red-500">
        {error}
      </div>
    );
  }

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

export default ChartAreaProfit;