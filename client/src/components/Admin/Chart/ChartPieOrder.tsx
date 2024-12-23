import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import instance from "../../../instance/instance";
import { Table } from "flowbite-react";

interface PaymentMethod {
  payment_method: string;
  count: number;
}

interface OrderData {
  total_orders: number;
  delivered_orders: number;
  canceled_orders: number;
}

const ChartPieOrder = () => {
  const [dataPaymentMethod, setDataPaymentMethod] = useState<PaymentMethod[]>([]);
  const [dataPie, setDataPie] = useState<OrderData>();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get("thong-ke/don-hang");
        setDataPaymentMethod(data.payment_methods);
        setDataPie(data)
      } catch (error) {
        console.error("Failed to fetch payment method data:", error);
      }
    })();
  }, []);

  const chartOptions = {
    chart: {
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -180,
        endAngle: 180,
        offsetY: 10,
      },
    },
    title: {
      text: "BIỂU ĐỒ THỐNG KÊ PTTT",
      align: 'center',
    },
    legend: {
      position: "bottom",
      labels: {
        colors: ["#000"],
      },
      markers: {
        width: 15,
        height: 15,
      },
    },
    labels: dataPaymentMethod.map((item) => item.payment_method),
  };

  return (
    <div className="bg-util col-span-4 p-5 rounded-md">
      <ReactApexChart
        options={chartOptions}
        series={dataPaymentMethod.map((item) => item.count)}
        type="donut"
      />
      <div className="mt-5">
        <Table>
          <Table.Head>
            <Table.HeadCell className="bg-primary/90 text-util">Tổng đơn</Table.HeadCell>
            <Table.HeadCell className="bg-primary/90 text-util">Đã giao</Table.HeadCell>
            <Table.HeadCell className="bg-primary/90 text-util">Đã huỷ</Table.HeadCell>
          </Table.Head>
          <Table.Body className="bg-util shadow-chart overflow-hidden rounded-md">
            <Table.Row>
              <Table.Cell className="text-center">{dataPie?.total_orders}</Table.Cell>
              <Table.Cell className="text-center">{dataPie?.delivered_orders}</Table.Cell>
              <Table.Cell className="text-center">{dataPie?.canceled_orders}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default ChartPieOrder;
