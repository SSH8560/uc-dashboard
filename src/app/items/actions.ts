"use server";

import { createClient } from "@/lib/apis/supabase/server";
import type { Item, MarketItem, PostItemParam } from "./actions";
import type { Page } from "@/lib/apis/martApi/definition.d";

export const getItemsFromMarket: ({
  query,
  type,
}: {
  query: string;
  type: "barcode" | "name";
}) => Promise<Page<MarketItem>> = async ({ query, type }) => {
  const res = await fetch(
    `${process.env.MART_SERVER_URL}/goods?${type}=${query}`
  );
  return res.json();
};

export const getItems = async () => {
  try {
    const { error, data } = await createClient().from("items").select("*");

    if (error) throw new Error(error.message);

    return data as Item[];
  } catch (e) {
    throw e;
  }
};

export const postItem = async ({
  name,
  barcode,
  buy_price,
  sell_price,
  unit,
  category_id,
}: PostItemParam) => {
  try {
    const { error } = await createClient().from("items").insert([
      {
        name,
        barcode,
        buy_price,
        sell_price,
        unit,
        category_id,
      },
    ]);

    if (error) throw new Error(error.message);
  } catch (e) {
    throw e;
  }
};
