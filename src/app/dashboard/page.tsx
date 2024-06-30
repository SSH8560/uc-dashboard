import HourlySalesChart from "@/components/chart/HourlySalesChart";
import { getSales } from "./actions";
import DashBoard from "@/components/DashBoard";
import { endOfDay, startOfDay, subDays } from "date-fns";

export default async function DashBoardPage() {
  const today = new Date();
  const salesToday = await getSales({
    startDate: startOfDay(today),
    endDate: endOfDay(today),
    type: "HOURLY",
  });
  console.log(salesToday);

  // const dailySalesNear2Month = await getSales({
  //   startDate: subDays(today, 59),
  //   endDate: today,
  //   type: "DAILY",
  // });

  // console.log(dailySalesNear2Month.length);

  return (
    <div>
      <HourlySalesChart data={salesToday} />
      <DashBoard />
    </div>
  );
}
