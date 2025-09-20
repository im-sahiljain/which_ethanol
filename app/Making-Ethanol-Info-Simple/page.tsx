"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropletIcon,
  DatabaseIcon,
  TargetIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Header } from "@/components/header";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl space-y-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent tracking-tight leading-tight">
            Making Ethanol Info Simple
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium mb-8">
            Your trusted guide to ethanol compatibility in India
          </p>
          <Button size="lg" className="group">
            Check Your Vehicle
            <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <Card className="p-6 mb-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <DropletIcon className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-semibold">Why We Built This</h2>
          </div>
          <p className="text-lg leading-relaxed">
            Confused about which ethanol blends (E5, E10, E20) are compatible
            with your vehicle? You're not alone. That's why we built this
            website — to make ethanol compatibility information clear,
            accessible, and easy to understand for vehicle owners across India.
          </p>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-950">
                <DatabaseIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold">Our Data</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Our data is compiled using advanced AI tools and publicly
              available sources. We organize it in a simple format so you can
              quickly find what you need.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-950">
                <TargetIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold">Our Mission</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Our mission is to make ethanol information transparent, reliable,
              and continuously improving — helping you make informed decisions
              safely and confidently.
            </p>
          </Card>
        </div>

        <Card className="p-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200">
              Important Note
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            While we strive for accuracy, this website is a{" "}
            <strong>reference guide only</strong>. Always verify compatibility
            with your vehicle manufacturer, consult your user manual, or check
            with authorized service centers before making any fuel-related
            decisions.
          </p>
        </Card>
      </main>
    </>
  );
}
