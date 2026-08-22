import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Making Ethanol Info Simple | Which Ethanol",
  description:
    "Learn about E5, E10, and E20 ethanol compatibility and make informed fuel decisions for your vehicle in India.",
  alternates: {
    canonical: "/Making-Ethanol-Info-Simple",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
