// import ChartAreaProfit from "../../../components/Admin/Chart/ChartAreaProfit";
import ChartAreaProfit from "../../../components/Admin/Chart/ChartAreaProfit";
import ChartAreaRevenue from "../../../components/Admin/Chart/ChartAreaRevenue";
import ChartPieOrder from "../../../components/Admin/Chart/ChartPieOrder";

const ChartAdmin = () => {
  return (
    <div className="grid grid-cols-12 gap-5">
      <ChartAreaRevenue />
      <ChartPieOrder />
      <ChartAreaProfit />
    </div>
  );
};

export default ChartAdmin;
