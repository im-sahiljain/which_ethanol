"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut,
  Database,
  Settings,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Activity,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import type { DashboardStats } from "@/lib/database/stats";
import type { VehicleData } from "@/lib/models/vehicle";

interface AdminDashboardProps {
  admin: {
    _id: string;
    username: string;
    email: string;
    role: string;
  };
}

export function AdminDashboard({ admin }: AdminDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([]);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (activeTab !== "overview") {
      loadVehicles(activeTab as "verified" | "pending" | "unverified");
    }
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        console.log("Dashboard stats:", data);
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  console.log("Stats in component:", stats);

  const loadVehicles = async (status: string) => {
    setVehiclesLoading(true);
    try {
      const response = await fetch(
        `/api/admin/vehicles?status=${status}&limit=20`
      );
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || []);
      }
    } catch (error) {
      console.error("Failed to load vehicles:", error);
    } finally {
      setVehiclesLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      document.cookie =
        "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this vehicle? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleteLoading(vehicleId);
    try {
      const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh the current tab
        if (activeTab !== "overview") {
          loadVehicles(activeTab as "verified" | "pending" | "unverified");
        }
        loadStats(); // Refresh stats
      } else {
        alert("Failed to delete vehicle");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete vehicle");
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLengthOfStats = (stats: VehicleData[]) => {
    return stats.length;
  };

  const getVerifiedRecords = (stats: VehicleData[]) => {
    return stats.filter(
      (stat) => stat.verification_id && stat.verification_id !== null
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-primary-foreground/80">
                Welcome back, {admin.username}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={() => router.push("/admin/vehicles/add")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
              <Button
                variant="secondary"
                onClick={handleLogout}
                disabled={loading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="unverified">Unverified</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Vehicles
                  </CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {getLengthOfStats(stats)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Vehicle records in database
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Verified Records
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {getVerifiedRecords(stats).length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Verified vehicle records
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Review
                  </CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats?.pendingRecords || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Records awaiting verification
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Ratings
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalRatings || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    User feedback received
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => router.push("/admin/brands")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Brands
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => router.push("/admin/brands/add")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Brand
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => router.push("/admin/vehicles/add")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Model
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => router.push("/admin/vehicles/add")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Vehicle
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("pending")}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Review Pending Records ({stats?.pendingRecords || 0})
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("verified")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    View Verified Records
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentActivity
                      ?.slice(0, 5)
                      .map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-foreground">
                              {activity.description}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {formatDate(activity.timestamp)}
                            </p>
                          </div>
                        </div>
                      )) || (
                      <p className="text-muted-foreground">
                        No recent activity
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vehicle Lists for each status */}
          {["verified", "pending", "unverified"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold capitalize">
                  {status} Vehicles
                </h2>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">
                    {status === "verified" && stats?.verifiedRecords}
                    {status === "pending" && stats?.pendingRecords}
                    {status === "unverified" && stats?.unverifiedRecords}
                    {" records"}
                  </Badge>
                  <Button onClick={() => router.push("/admin/vehicles/add")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vehicle
                  </Button>
                </div>
              </div>

              {vehiclesLoading ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center text-muted-foreground">
                      Loading vehicles...
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {vehicles.map((vehicle) => (
                    <Card
                      key={vehicle._id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">
                                {vehicle.brand} {vehicle.model} (
                                {vehicle.yearOfManufacture})
                              </h3>
                              <Badge
                                className={`${getStatusColor(
                                  vehicle.verificationStatus
                                )} flex items-center gap-1`}
                              >
                                {getStatusIcon(vehicle.verificationStatus)}
                                {vehicle.verificationStatus}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {vehicle.engineVariant}
                            </p>
                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  vehicle.fuelCompatibility.E5
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                E5 {vehicle.fuelCompatibility.E5 ? "✓" : "✗"}
                              </Badge>
                              <Badge
                                variant={
                                  vehicle.fuelCompatibility.E10
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                E10 {vehicle.fuelCompatibility.E10 ? "✓" : "✗"}
                              </Badge>
                              <Badge
                                variant={
                                  vehicle.fuelCompatibility.E20
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                E20 {vehicle.fuelCompatibility.E20 ? "✓" : "✗"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground text-right">
                              <div>👍 {vehicle.rating.thumbsUp}</div>
                              <div>👎 {vehicle.rating.thumbsDown}</div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/admin/vehicles/edit/${vehicle._id}`
                                )
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteVehicle(vehicle._id!)}
                              disabled={deleteLoading === vehicle._id}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {vehicles.length === 0 && (
                    <Card>
                      <CardContent className="py-8">
                        <div className="text-center text-muted-foreground">
                          No {status} vehicles found
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
