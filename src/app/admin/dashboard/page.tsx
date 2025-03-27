import {
  getCategoryData,
  getLatestUsers,
  getMonthlyOrders,
} from "@/src/actions/orders";
import PageComponent from "./page-component";

const AdminDashboard = async () => {
  const monthlyOrders = await getMonthlyOrders();

  const categoryData = await getCategoryData();

  const latestUsers = await getLatestUsers();

  return (
    <PageComponent
      monthlyOrders={monthlyOrders}
      categoryData={categoryData}
      latestUsers={latestUsers}
    />
  );
};

export default AdminDashboard;
