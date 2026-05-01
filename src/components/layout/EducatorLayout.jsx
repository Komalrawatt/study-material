import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  User,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

const educatorNav = [
  { path: "/educator", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/educator/courses", label: "My Courses", icon: BookOpen },
  { path: "/educator/materials", label: "Create Course", icon: FileText },
  { path: "/educator/profile", label: "Profile", icon: User },
];

export default function EducatorLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-['Outfit']">
            <span className="gradient-text">Educator</span> Panel
          </h1>
          <p className="text-xs text-muted-foreground">Manage your courses and materials</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {educatorNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
                <ChevronRight className="w-3 h-3 ml-auto hidden lg:block opacity-50" />
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
