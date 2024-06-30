import ItemTable from "@/components/ItemTable";
import { getItems } from "./actions";
import { columns } from "@/components/Columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ItemPageProps {
  searchParams?: {
    page?: number;
  };
}

export default async function ItemPage({ searchParams }: ItemPageProps) {
  const options: { page?: number } = {};
  if (searchParams) {
    if (searchParams.page) options.page = searchParams.page;
  }
  const items = await getItems(options);

  return (
    <>
      <Button title="상품등록">
        <Link href="/items/new">상품등록</Link>
      </Button>
      <ItemTable data={items} columns={columns} />
    </>
  );
}
