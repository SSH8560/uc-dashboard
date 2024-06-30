"use client";

import { Sales } from "@/app/dashboard/actions";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";

interface SalesChartProps {
  data: Sales[];
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <LineChart
      width={1000}
      height={500}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis />
      <Legend />
      <Line
        type="monotone"
        dataKey="totalSales"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
}
