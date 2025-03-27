import { getCategoriesWithProducts } from "@/src/actions/categories";
import { getProductsWithCategories } from "@/src/actions/products";
import { ProductPageComponent } from "@/src/app/admin/products/page-component";

export default async function Products() {
  const categories = await getCategoriesWithProducts();
  const productsWithCategories = await getProductsWithCategories();

  console.log(productsWithCategories);

  return (
    <ProductPageComponent
      categories={categories}
      productsWithCategories={productsWithCategories}
    />
  );
}
