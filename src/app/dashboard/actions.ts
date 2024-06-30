"use server";

import { createClient } from "@/lib/apis/supabase/server";
import { toDateString } from "@/lib/utils/date";
import { revalidatePath } from "next/cache";
import { URLSearchParams } from "url";

const BASE_URL = process.env.MART_SERVER_URL;

export const getSales = async ({
  startDate,
  endDate,
  type,
}: {
  startDate: Date;
  endDate: Date;
  type: "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY";
}) => {
  try {
    const startDateString = startDate.toISOString();
    const endDateString = endDate.toISOString();
    console.log(startDateString);
    const params = new URLSearchParams({
      type,
      start: startDateString,
      end: endDateString,
    });

    const { data } = await createClient().auth.getSession();
    const response = await fetch(`${BASE_URL}/sales?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${data.session?.access_token}`,
      },
    });
    if (!response.ok) throw new Error(`${response.status}`);

    return (await response.json()) as Sales[];
  } catch (e) {
    throw e;
  }
};

export type Sales = {
  day: number;
  year: number;
  month: number;
  week: null | number;
  totalSales: number;
};
