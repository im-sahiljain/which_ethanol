import { VehicleSearch } from "@/components/vehicle-search";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Shield, Database, Users } from "lucide-react";
import { DisclaimerDialog } from "@/components/disclaimer-dialog";
import { VisitTracker } from "@/components/visit-tracker";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <VisitTracker />
      <DisclaimerDialog />
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs md:text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Find your vehicle's ethanol compatibility
            </div>
            <h1 className="text-4xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent mb-6 text-balance leading-tight">
              Looking for Ethanol Compatibility?
            </h1>
            <p className="text-base md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              Find reliable fuel compatibility information for your vehicle.
              Search by brand, model, and year to ensure you're using the right
              fuel type.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl mb-4">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Comprehensive Database
              </h3>
              <p className="text-muted-foreground text-sm">
                Extensive collection of vehicle fuel compatibility data from
                verified sources
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Compiled through AI
              </h3>
              <p className="text-muted-foreground text-sm">
                All data is compiled by AI from online sources.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
              <p className="text-muted-foreground text-sm">
                Review compatibility information to help other users
              </p>
            </div>
          </div>

          <VehicleSearch />
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
