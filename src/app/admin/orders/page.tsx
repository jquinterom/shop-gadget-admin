import { getOrdersWithProducts } from "@/src/actions/orders";
import PageComponent from "@/src/app/admin/orders/page-component";

const Orders = async () => {
  const ordersWithProducts = await getOrdersWithProducts();

  if (!ordersWithProducts)
    return (
      <div className="text-center font-bold text-2xl">No orders found</div>
    );

  console.log("orderWithProducts", ordersWithProducts[0].order_items);

  return <PageComponent ordersWithProducts={ordersWithProducts} />;
};

export default Orders;
