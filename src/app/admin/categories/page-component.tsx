"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuid } from "uuid";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CategoryTableRow } from "@/components/category";
import {
  createCategorySchema,
  CreateCategorySchema,
} from "@/src/app/admin/categories/create-category.schema";
import { CategoriesWithProductsResponse } from "@/src/app/admin/categories/categories.types";
import { CategoryForm } from "@/src/app/admin/categories/category-form";
import {
  createCategory,
  deleteCategory,
  imageUploadHandler,
  updateCategory,
} from "@/src/actions/categories";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  categories: CategoriesWithProductsResponse;
};

const CategoryPageComponent = ({ categories }: Props) => {
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);

  const [currentCategory, setCurrentCategory] =
    useState<CreateCategorySchema | null>(null);

  const form = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  const router = useRouter();

  const submitCategoryHandler: SubmitHandler<CreateCategorySchema> = async (
    data
  ) => {
    const { image, name, intent = "create" } = data;

    const handleImageUpload = async () => {
      const uniqueId = uuid();
      const fileName = `category/category-${uniqueId}`;
      const file = new File([data.image[0]], fileName);
      const formData = new FormData();
      formData.append("file", file);

      return await imageUploadHandler(formData);
    };

    switch (intent) {
      case "create": {
        const imageUrl = await handleImageUpload();

        if (imageUrl) {
          await createCategory({ imageUrl, name });
          form.reset();
          router.refresh();
          setIsCreateCategoryModalOpen(false);
          toast.success("Category created successfully");
        }
        break;
      }
      case "update": {
        if (image && currentCategory?.slug) {
          const imageUrl = await handleImageUpload();
          if (imageUrl) {
            await updateCategory({
              imageUrl,
              name,
              slug: currentCategory.slug,
              intent: "update",
            });
            form.reset();
            router.refresh();
            setIsCreateCategoryModalOpen(false);
            toast.success("Category updated successfully");
          }
        }
        break;
      }

      default: {
        console.error("No valid intent");

        break;
      }
    }
  };

  const deleteCategoryHandler = async (id: number) => {
    await deleteCategory(id);
    router.refresh();
    toast.success("Category deleted successfully");
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 py-0 md:gap-8">
      <div className="flex item my-10">
        <div className="ml-auto flex items-center gap-2">
          <Dialog
            open={isCreateCategoryModalOpen}
            onOpenChange={() =>
              setIsCreateCategoryModalOpen(!isCreateCategoryModalOpen)
            }
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="h-8 gap-1 cursor-pointer"
                onClick={() => {
                  setCurrentCategory(null);
                  setIsCreateCategoryModalOpen(true);
                }}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add category
                </span>
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[500px] max-w-full">
              <DialogHeader>
                <DialogTitle>Create Category</DialogTitle>
              </DialogHeader>
              <DialogContent>
                <CategoryForm
                  form={form}
                  onSubmit={submitCategoryHandler}
                  defaultValues={currentCategory}
                />
              </DialogContent>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardContent>
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="md:table-cell">Created at</TableHead>
                  <TableHead className="md:table-cell">Products</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {categories.map((category) => (
                  <CategoryTableRow
                    key={category.id}
                    category={category}
                    setCurrentCategory={setCurrentCategory}
                    setIsCreateCategoryModalOpen={setIsCreateCategoryModalOpen}
                    deleteCategoryHandler={deleteCategoryHandler}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </CardHeader>
      </Card>
    </main>
  );
};

export default CategoryPageComponent;
