"use server";

import slugify from "slugify";
import { createClient } from "@/src/supabase/server";
import {
  ProductsWithCategoriesResponse,
  UpdateProductSchema,
} from "@/src/app/admin/products/products.types";
import { CreateProductSchemaServer } from "@/src/app/admin/products/schema";

export const getProductsWithCategories =
  async (): Promise<ProductsWithCategoriesResponse> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("product")
      .select("*, category:category(*)")
      .returns<ProductsWithCategoriesResponse>();

    if (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }

    return data || [];
  };

export const createProduct = async ({
  category,
  heroImage,
  images,
  maxQuantity,
  price,
  title,
}: CreateProductSchemaServer) => {
  const supabase = await createClient();
  const slug = slugify(title);

  const { data, error } = await supabase.from("product").insert({
    category,
    heroImage,
    imagesUrl: images,
    maxQuantity,
    price,
    slug,
    title,
  });

  if (error) {
    throw new Error(`Error creating product: ${error.message}`);
  }

  return data;
};

export const updateProduct = async ({
  category,
  heroImage,
  imagesUrl,
  maxQuantity,
  price,
  slug,
  title,
}: UpdateProductSchema) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("product").update({
    category,
    heroImage,
    imagesUrl,
    maxQuantity,
    price,
    slug,
    title,
  });

  if (error) {
    throw new Error(`Error updating product: ${error.message}`);
  }

  return data;
};

export const deleteProduct = async (slug: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("product").delete().match({
    slug,
  });

  if (error) {
    throw new Error(`Error deleting product: ${error.message}`);
  }

  return data;
};
