import Link from "next/link";
import { Car, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 ">
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
                Which Ethanol
              </span>
              <div className="text-xs text-muted-foreground">
                Check Ethanol Compatibility
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
              <Link href="/Making-Ethanol-Info-Simple">About</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="hidden border-primary/20 hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              <Link href="/admin">Admin Portal</Link>
            </Button>
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 p-4">
                <Link href="/" className="text-lg font-medium">
                  Search
                </Link>
                <Link
                  href="/Making-Ethanol-Info-Simple"
                  className="text-lg font-medium"
                >
                  About
                </Link>
                <Link href="/admin" className="hidden text-lg font-medium">
                  Admin Portal
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
