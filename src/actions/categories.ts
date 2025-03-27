"use server";

import { CategoriesWithProductsResponse } from "../app/admin/categories/categories.types";
import {
  CreateCategorySchemaServer,
  UpdateCategorySchema,
} from "../app/admin/categories/create-category.schema";
import { createClient } from "../supabase/server";
import slugify from "slugify";

export const getCategoriesWithProducts =
  async (): Promise<CategoriesWithProductsResponse> => {
    const supabase = createClient();

    const { data, error } = await (await supabase)
      .from("category")
      .select("*, products:product(*)")
      .returns<CategoriesWithProductsResponse>();

    if (error) {
      throw new Error(`Error fetching categories:  ${error.message}`);
    }

    return data || [];
  };

export const imageUploadHandler = async (formData: FormData) => {
  if (!formData) return;

  const fileEntry = formData.get("file") as File;

  if (!(fileEntry instanceof File)) throw new Error("Expected a file");

  const fileName = fileEntry.name;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from("app-images")
      .upload(fileName, fileEntry, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      throw new Error(`Error uploading image`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("app-images").getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Error uploading image");
  }
};

export const createCategory = async ({
  imageUrl,
  name,
}: CreateCategorySchemaServer) => {
  const supabase = createClient();

  const slug = slugify(name, { lower: true });

  const { data, error } = await (await supabase).from("category").insert({
    name,
    imageUrl,
    slug,
  });

  if (error) throw new Error(`Error creating category: ${error.message}`);

  return data;
};

export const updateCategory = async ({
  imageUrl,
  name,
  slug,
}: UpdateCategorySchema) => {
  const supabase = createClient();

  const { data, error } = await (
    await supabase
  )
    .from("category")
    .update({
      name,
      imageUrl,
      slug,
    })
    .match({ slug });

  if (error) throw new Error(`Error updating category: ${error.message}`);

  return data;
};

export const deleteCategory = async (id: number) => {
  const supabase = createClient();

  const { error } = await (await supabase)
    .from("category")
    .delete()
    .match({ id });

  if (error) throw new Error(`Error deleting category: ${error.message}`);
};
