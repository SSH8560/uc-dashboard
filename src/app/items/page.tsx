import ItemTable from "@/components/ItemTable";
import { getItems } from "./actions";
import { columns } from "@/components/Columns";

export default async function ItemPage() {
  const items = await getItems();
  return (
    <>
      <ItemTable data={items} columns={columns} />
    </>
  );
}
