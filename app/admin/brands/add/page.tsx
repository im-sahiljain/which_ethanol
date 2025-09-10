import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/database/admin";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { BrandForm } from "@/components/admin/brand-form";

export default async function AddBrandPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const admin = await verifyAdminToken(token);
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Add New Brand</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <BrandForm />
      </main>
    </div>
  );
}
