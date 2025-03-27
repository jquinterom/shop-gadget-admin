"use server";

import { createClient } from "@/src/supabase/server";
import { revalidatePath } from "next/cache";
import { sendNotification } from "./notifications";

export const getOrdersWithProducts = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("order")
    .select("*, order_items:order_item(*, product(*)), user(*)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  const supabase = await createClient();
  const { error } = await supabase
    .from("order")
    .update({ status })
    .match({ id: orderId });

  if (error) throw new Error(error.message);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user.id ?? "";

  await sendNotification(userId, status);

  revalidatePath("/admin/orders");
};

export const getMonthlyOrders = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("order").select("created_at");

  if (error) throw new Error(error.message);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const orderByMonth = data.reduce(
    (acc: Record<string, number>, order: { created_at: string }) => {
      const date = new Date(order.created_at);
      const monthName = monthNames[date.getUTCMonth()];

      if (!acc[monthName]) acc[monthName] = 0;
      acc[monthName]++;

      return acc;
    },
    {}
  );

  return Object.keys(orderByMonth).map((month) => ({
    name: month,
    orders: orderByMonth[month],
  }));
};

export const getCategoryData = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("category")
    .select("name, products:product(id)");

  if (error) throw new Error(`Error fetching category data: ${error.message}`);

  const categoryData = data.map(
    (category: { name: string; products: { id: number }[] }) => ({
      name: category.name,
      products: category.products.length,
    })
  );

  return categoryData;
};

export const getLatestUsers = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("id, email, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw new Error(`Error fetching latest users: ${error.message}`);

  return data.map(
    (user: { id: string; email: string; created_at: string | null }) => ({
      id: user.id,
      email: user.email,
      date: user.created_at,
    })
  );
};
