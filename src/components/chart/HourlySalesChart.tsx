"use client";

import { Sales } from "@/app/dashboard/actions";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardTitle } from "../ui/card";

interface HourlySalesChartProps {
  data: Sales[];
}

export default function HourlySalesChart({ data }: HourlySalesChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Card className="w-min p-4">
      <CardTitle>
        <h1 className="text-center">오늘의 매출</h1>
      </CardTitle>
      <CardContent>
        <BarChart width={400} height={400} data={data}>
          <YAxis />
          <XAxis dataKey={"hour"} domain={[0, 24]} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Bar dataKey="totalSales" fill="#8884d8" />
        </BarChart>
      </CardContent>
    </Card>
  );
}
