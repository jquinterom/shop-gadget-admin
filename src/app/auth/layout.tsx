import { ADMIN } from "@/src/constants/constants";
import { createClient } from "@/src/supabase/server";
import { redirect } from "next/navigation";

const AdminLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const supabase = createClient();
  const { data: authData } = await (await supabase).auth.getUser();

  if (authData?.user) {
    const { data, error } = await (await supabase)
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (error || !data) {
      console.log("Error fetching user data", error);
      return;
    }

    if (data.type === ADMIN) {
      return redirect("/admin");
    }
  }
  return <>{children}</>;
};

export default AdminLayout;
