import { Product } from "./product";

export type Category = {
  name: string;
  image_url: string;
  slug: string;
  products: Product[];
};