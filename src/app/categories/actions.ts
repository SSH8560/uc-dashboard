"use server";

import { createClient } from "@/lib/apis/supabase/server";
import { revalidatePath } from "next/cache";
import { Category } from "./actions.d";

export const getCategories = async () => {
  const client = createClient();
  const { data, error } = await client.from("categories").select("*");

  if (error) throw new Error(error.message);

  return data as Category[];
};

export const updateCategory = async (
  id: number,
  { name }: { name: string }
) => {
  console.log(name);

  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .update([{ name }])
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/categories");
};

export const createCategory = async ({
  name,
  parent,
}: {
  name: string;
  parent: number;
}) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .insert([{ name, parent }]);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/categories");
};

export const deleteCategory = async (id: number) => {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/categories");
};
