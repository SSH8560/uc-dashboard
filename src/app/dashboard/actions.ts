"use server";

export const getSales = async ({
  from,
  to,
  type,
}: {
  from: string;
  to: string;
  type: "DAILY" | "WEEKLY" | "MONTHLY";
}) => {
  try {
    const result = await fetch(
      `http://localhost:8080/api/sales?start=${from}&end=${to}&type=${type}`
    );
    if (!result.ok) throw Error("서버가 응답하지 않습니다.");

    return await result.json();
  } catch (e) {
    throw e;
  }
};
