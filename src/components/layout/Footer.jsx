import { Link } from "react-router-dom";
import { GraduationCap, Mail, Heart, Globe, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Platform: [
    { label: "Courses", path: "/courses" },
    { label: "Mock Tests", path: "/mock-tests" },
    { label: "Dashboard", path: "/dashboard" },
  ],
  Resources: [
    { label: "Notes", path: "/courses" },
    { label: "Question Banks", path: "/courses" },
    { label: "Lab Manuals", path: "/courses" },
  ],
  Company: [
    { label: "About Us", path: "/" },
    { label: "Contact", path: "/" },
    { label: "Privacy Policy", path: "/" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold font-['Outfit']">
                 <span className="gradient-text">Study</span>Materials
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your complete academic resource platform. Access notes, videos, mock tests, and more — all in one place.
            </p>
            {/* <div className="flex items-center gap-3 mt-4">
              <a href="#" className="text-muted-foreground hover:text-emerald-400 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-emerald-400 transition-colors">
                <ExternalLink className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-emerald-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div> */}
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold font-['Outfit'] text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} StudyMaterials. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
