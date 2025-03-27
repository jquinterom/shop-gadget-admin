import { getCategoriesWithProducts } from "@/src/actions/categories";
import CategoryPageComponent from "./page-component";

const Categories = async () => {
  const categories = await getCategoriesWithProducts();

  console.log(categories);

  return <CategoryPageComponent categories={categories} />;
};

export default Categories;
