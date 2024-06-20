"use client";

import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Item } from "@/app/dashboard/items/actions.d";
import { ColumnDef, SortDirection } from "@tanstack/react-table";
import { Label } from "./ui/label";

export const columns: ColumnDef<Item>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "id",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <SortButton
          label="상품명"
          sorted={column.getIsSorted()}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "unit",
    header: ({ column }) => {
      return <Label>단위</Label>;
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("unit")}</div>,
  },
  {
    accessorKey: "barcode",
    header: ({ column }) => {
      return <Label>바코드</Label>;
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("barcode")}</div>
    ),
  },
  {
    accessorKey: "sell_price",
    header: ({ column }) => {
      return (
        <SortButton
          label="판매가"
          sorted={column.getIsSorted()}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("sell_price")}</div>
    ),
  },
  {
    accessorKey: "buy_price",
    header: ({ column }) => {
      return <Label>매입가</Label>;
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("buy_price")}</div>
    ),
  },
  {
    accessorKey: "margin",
    header: ({ column }) => {
      return (
        <SortButton
          label="마진"
          sorted={column.getIsSorted()}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      );
    },
    cell: ({ row }) => {
      const sellPrice = row.getValue("sell_price") as number;
      const buyPrice = row.getValue("buy_price") as number;

      return (
        <div className="lowercase">{+(sellPrice / buyPrice).toFixed(2)}</div>
      );
    },
    sortingFn: ({ original: a }, { original: b }, columnId) => {
      const aMargin = a.sell_price / a.buy_price;
      const bMargin = b.sell_price / b.buy_price;

      return aMargin - bMargin;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.name)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function SortButton({
  label,
  sorted,
  onClick,
}: {
  label: string;
  sorted: false | SortDirection;
  onClick: () => void;
}) {
  const iconClassName = "ml-2 h-4 w-4";

  return (
    <Button className="p-0" variant="ghost" onClick={onClick}>
      {label}
      {!sorted && <ArrowUpDown className={iconClassName} />}
      {sorted === "asc" && <ArrowUp className={iconClassName} />}
      {sorted === "desc" && <ArrowDown className={iconClassName} />}
    </Button>
  );
}
