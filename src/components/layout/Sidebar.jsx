import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Home,
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  User,
  LogOut,
  X,
  GraduationCap,
  Presentation,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { setSidebarOpen } from "@/store/slices/uiSlice";
import { logoutUser } from "@/store/slices/authSlice";

const iconMap = { Home, LayoutDashboard, BookOpen, ClipboardCheck, User, Presentation };

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: "Home" },
  { path: "/dashboard", label: "Dashboard", icon: "LayoutDashboard", protected: true },
  { path: "/courses", label: "Courses", icon: "BookOpen" },
  { path: "/mock-tests", label: "Mock Tests", icon: "ClipboardCheck", protected: true },
  { path: "/profile", label: "Profile", icon: "User", protected: true },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const isEducator = user?.role === "educator";

  const allNav = [
    ...NAV_ITEMS,
    ...(isAuthenticated && isEducator ? [{ path: "/educator", label: "Educator Panel", icon: "Presentation", protected: true }] : []),
  ];

  const filteredNav = allNav.filter(
    (item) => !item.protected || isAuthenticated
  );

  const handleNavClick = (path) => {
    navigate(path);
    dispatch(setSidebarOpen(false));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(setSidebarOpen(false));
    navigate("/");
  };

  return (
    <Sheet open={sidebarOpen} onOpenChange={(open) => dispatch(setSidebarOpen(open))}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-['Outfit'] text-lg">
                <span className="gradient-text">Study</span>Materials
            </span>
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <nav className="flex flex-col gap-1 p-4">
          {filteredNav.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <Separator />
        <div className="p-4">
          {isAuthenticated ? (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-400 hover:text-red-400 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleNavClick("/login")}
              >
                Log In
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                onClick={() => handleNavClick("/signup")}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
