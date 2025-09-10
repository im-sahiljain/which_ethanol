import Link from "next/link";
import { Car, Mail, FileText, Shield, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-muted/50 to-card/80 backdrop-blur-sm border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">FuelCheck</h3>
                <p className="text-xs text-muted-foreground">
                  Vehicle Database
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              A comprehensive database providing reliable fuel compatibility
              information for vehicles worldwide. Trusted by automotive
              professionals and enthusiasts.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 text-green-600" />
              <span>Verified by automotive experts</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/guide"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  Fuel Types Guide
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/standards"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  Compatibility Standards
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  Safety Information
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Contact
            </h4>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground leading-relaxed">
                For questions or data submissions, please contact our team.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="mailto:support@fuelcheck.com"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  support@fuelcheck.com
                </Link>
                <Link
                  href="/admin"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Admin Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 FuelCheck. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/api-docs"
                className="hover:text-primary transition-colors"
              >
                API Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// export function Footer() {
//   return (
//     <footer className="bg-muted mt-16">
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div>
//             <h3 className="font-semibold text-primary mb-4">About FuelCheck</h3>
//             <p className="text-muted-foreground text-sm">
//               A comprehensive database providing reliable fuel compatibility information for vehicles worldwide.
//             </p>
//           </div>
//           <div>
//             <h3 className="font-semibold text-primary mb-4">Resources</h3>
//             <ul className="space-y-2 text-sm text-muted-foreground">
//               <li>Fuel Types Guide</li>
//               <li>Compatibility Standards</li>
//               <li>Safety Information</li>
//             </ul>
//           </div>
//           <div>
//             <h3 className="font-semibold text-primary mb-4">Contact</h3>
//             <p className="text-muted-foreground text-sm">For questions or data submissions, please contact our team.</p>
//           </div>
//         </div>
//         <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
//           © 2024 FuelCheck. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   )
// }
