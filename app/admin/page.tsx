// import { redirect } from "next/navigation";
// import { cookies } from "next/headers";
// import { verifyAdminToken } from "@/lib/database/admin";
// import { AdminDashboard } from "@/components/admin/dashboard";

// export default async function AdminPage() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("admin_token")?.value;

//   if (!token) {
//     redirect("/admin/login");
//   }

//   const admin = await verifyAdminToken(token);
//   if (!admin) {
//     redirect("/admin/login");
//   }

//   return <AdminDashboard admin={{ ...admin, role: admin.role ?? "" }} />;
// }

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/database/admin";
import { AdminDashboard } from "@/components/admin/dashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const admin = await verifyAdminToken(token);
  if (!admin) {
    redirect("/admin/login");
  }

  const plainAdmin = {
    _id: admin._id?.toString?.() ?? "",
    username: admin.username ?? "",
    email: admin.email ?? "",
    role: admin.role ?? "",
  };

  return <AdminDashboard admin={plainAdmin} />;
}
