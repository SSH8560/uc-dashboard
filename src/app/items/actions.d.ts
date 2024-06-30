export type Item = {
  id: number;
  name: string;
  sell_price: number;
  buy_price: number;
  barcode: string;
  unit: string;
  category_id: number;
  image_url?: string;
};

export type MarketItem = {
  id: number;
  name: string;
  sellPrice: number;
  buyPrice: number;
  barcode: string;
  unit: string;
};

export type PostItemParam = Omit<Item, "id">;
