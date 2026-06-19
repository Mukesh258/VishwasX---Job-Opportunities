import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Briefcase, 
  Users, 
  FileText, 
  ShieldCheck, 
  Plus, 
  Menu, 
  X, 
  LogOut, 
  User,
  Building2
} from "lucide-react";
import { getCurrentUser, signOut } from "@/lib/auth";
import { motion } from "framer-motion";

const companyNavItems = [
  { path: "/company/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/company/post-job", label: "Post Job", icon: Plus },
  { path: "/company/manage-jobs", label: "Manage Jobs", icon: ShieldCheck },
  { path: "/company/applicants", label: "Applicants", icon: Users },
  { path: "/company/resumes", label: "Resume Requests", icon: FileText },
];

const CompanyNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const currentUser = getCurrentUser();

  const handleSignOut = () => {
    signOut();
    navigate("/");
    setUserMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Label */}
        <div className="flex items-center gap-4">
          <Link to="/company/dashboard" aria-label="VishwasX Company" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="hidden md:block font-display font-bold text-xl tracking-tight text-foreground">
              Vishwas<span className="text-primary">X</span> <span className="text-xs font-medium text-muted-foreground ml-1 uppercase">Company</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border/50">
          {companyNavItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                  isActive
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground/70"}`} />
                <span>{label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side - User menu and Mobile toggle */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors shadow-sm"
              >
                <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left mr-1">
                  <p className="text-xs font-bold leading-none">{currentUser.name}</p>
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card p-1 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                   <div className="px-3 py-2 border-b border-border/50">
                    <p className="text-xs font-bold text-foreground truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{currentUser.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Company Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="lg:hidden p-2 text-foreground hover:bg-muted rounded-lg"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card p-4 space-y-1 animate-in slide-in-from-top duration-300">
          {companyNavItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${
                location.pathname === path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-border">
             <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CompanyNavbar;
