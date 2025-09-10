import Link from "next/link";
import { Car, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 group"
          >
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">
                FuelCheck
              </span>
              <div className="text-xs text-muted-foreground">
                Vehicle Database
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              asChild
              className="hover:bg-primary/10 hover:text-primary"
            >
              <Link href="/">Search</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="hover:bg-primary/10 hover:text-primary"
            >
              <Link href="/about">About</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-primary/20 hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              <Link href="/admin">Admin Portal</Link>
            </Button>
          </nav>

          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

// import Link from "next/link"
// import { Car } from "lucide-react"

// export function Header() {
//   return (
//     <header className="bg-primary text-primary-foreground shadow-sm">
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
//             <Car className="h-8 w-8" />
//             <span className="text-xl font-bold">FuelCheck</span>
//           </Link>
//           <nav className="hidden md:flex items-center gap-6">
//             <Link href="/" className="hover:opacity-80 transition-opacity">
//               Search
//             </Link>
//             <Link href="/about" className="hover:opacity-80 transition-opacity">
//               About
//             </Link>
//             <Link href="/admin" className="hover:opacity-80 transition-opacity">
//               Admin
//             </Link>
//           </nav>
//         </div>
//       </div>
//     </header>
//   )
// }
