"use client";

import React, { PureComponent, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Calendar } from "@/components/ui/calendar";
import dayjs, { Dayjs } from "dayjs";
import { getSales } from "@/app/dashboard/actions";

const Example = ({ initialData }: { initialData: any }) => {
  const [data, setData] = useState(initialData);
  const [isOpenedTypePopover, setIsOpenedTypePopover] = useState(false);
  const [isOpenedStartDatePopover, setIsOpenedStartDatePopover] =
    useState(false);
  const [isOpenedEndDatePopover, setIsOpenedEndDatePopover] = useState(false);
  const [currentReportFrequency, setCurrentReportFrequency] = useState("DAILY");
  const [startDate, setStartDate] = useState<Dayjs | undefined>(undefined);
  const [endDate, setEndDate] = useState<Dayjs | undefined>(undefined);

  const handlePressSearch = async () => {
    const sales = await getSales({
      from: startDate?.format("YYYY-MM-DD"),
      to: endDate?.format("YYYY-MM-DD"),
      type: currentReportFrequency,
    });
    setData(sales);
  };

  return (
    <>
      <Popover
        open={isOpenedStartDatePopover}
        onOpenChange={setIsOpenedStartDatePopover}
      >
        <PopoverTrigger asChild>
          <Button>{startDate ? startDate.format("YYYY-MM-DD") : "부터"}</Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <Calendar
            mode="single"
            selected={startDate?.toDate()}
            onSelect={(date) => {
              setStartDate(dayjs(date));
              setIsOpenedStartDatePopover(false);
            }}
          />
        </PopoverContent>
      </Popover>

      <Popover
        open={isOpenedEndDatePopover}
        onOpenChange={setIsOpenedEndDatePopover}
      >
        <PopoverTrigger asChild>
          <Button>{endDate ? endDate.format("YYYY-MM-DD") : "까지"}</Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <Calendar
            mode="single"
            selected={endDate?.toDate()}
            fromDate={startDate?.toDate()}
            onSelect={(date) => {
              setEndDate(dayjs(date));
              setIsOpenedEndDatePopover(false);
            }}
          />
        </PopoverContent>
      </Popover>

      <Popover open={isOpenedTypePopover} onOpenChange={setIsOpenedTypePopover}>
        <PopoverTrigger asChild>
          <Button aria-expanded={isOpenedTypePopover}>
            {
              reportFrequencies.find(
                (reportFrequency) =>
                  currentReportFrequency === reportFrequency.value
              )?.name
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandList>
              {reportFrequencies.map(({ name, value }) => (
                <CommandItem
                  key={value}
                  value={value}
                  onSelect={(currentValue) => {
                    setCurrentReportFrequency(currentValue);
                    setIsOpenedTypePopover(false);
                  }}
                >
                  {name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button onClick={handlePressSearch}>검색</Button>
      {data && (
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
          <YAxis dataKey="" />
          <Tooltip
            content={({ active, payload, label }) =>
              payload && <div>{payload[0].value}</div>
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalSales"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      )}
    </>
  );
};

const reportFrequencies = [
  { name: "일간", value: "DAILY" },
  {
    name: "주간",
    value: "WEEKLY",
  },
  {
    name: "월간",
    value: "MONTHLY",
  },
];
export default Example;
