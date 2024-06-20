import CategoryView from "@/components/CategoryView";
import { getCategories } from "./actions";
import { Category } from "./actions.d";
import CategoryBranch from "@/components/CategoryTreeBranch";
import TreeView from "react-accessible-treeview";
import { Label } from "@/components/ui/label";
import CategoryTreeView from "@/components/CategoryTreeView";

export default async function Categories() {
  // const client = createClient();
  // const { data, error } = await client.from("categories").select("*");

  // if (error) {
  //   throw new Error(error.message);
  // }

  // const tree = createCategoryTree(data);
  // if (!tree) {
  //   return;
  // }
  const categories = await getCategories();

  return (
    <>
      <CategoryTreeView categories={categories} />
      {/* <CategoryBranch category={createCategoryTree(categories)[0]} /> */}
      {/* <CategoryView categories={categories} /> */}
    </>
  );
}
