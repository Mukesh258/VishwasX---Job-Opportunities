import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BarChart3, BookOpen, Briefcase, FileText, Menu, X, LogOut, User, Search, MessageCircle, ShieldCheck, Users } from "lucide-react";
import { getCurrentUser, signOut } from "@/lib/auth";

const userNavItems = [
  { path: "/dashboard", label: "Career Analysis", icon: BarChart3 },
  { path: "/roadmap", label: "Learning Roadmap", icon: BookOpen },
  { path: "/opportunities", label: "Opportunities", icon: Briefcase },
  { path: "/messages", label: "Messages", icon: MessageCircle },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const currentUser = getCurrentUser();
  const isLandingPage = location.pathname === "/";
  
  const navItems = userNavItems;

  const handleSignOut = () => {
    signOut();
    navigate("/");
    setUserMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-none items-center justify-between px-0">
        {/* Logo */}
        {isLandingPage && (
          <Link to="/" aria-label="VishwasX" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary flex-shrink-0">
              <span className="text-sm font-bold text-primary-foreground">V</span>
            </div>
          </Link>
        )}

        {/* Desktop nav - Horizontal layout */}
        <div className={`hidden lg:flex items-center gap-0.5 flex-1 justify-center px-8 ${isLandingPage ? "invisible" : ""}`}>
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                location.pathname === path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">{label}</span>
            </Link>
          ))}
        </div>

        {/* Right side - User menu or Auth buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground flex-shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline whitespace-nowrap text-xs">{currentUser.name}</span>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-card z-50">
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors border-t border-border"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : isLandingPage ? (
            <div className="hidden sm:flex flex-col items-end gap-1">
              <Link
                to="/signin"
                className="rounded-lg px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                to="/company-verification"
                className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors whitespace-nowrap"
              >
                Company Verify
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/signin"
                className="rounded-lg px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-lg gradient-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-transform hover:scale-105 whitespace-nowrap"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground lg:hidden flex-shrink-0">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 lg:hidden">
          {!isLandingPage && navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                location.pathname === path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}

          {!currentUser && (
            <div className="mt-4 space-y-2 border-t border-border pt-4">
              <Link
                to="/signin"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-4 py-2 text-center text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                Sign In
              </Link>
              {isLandingPage ? (
                <Link
                  to="/company-verification"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-2 text-center text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  Company Verify
                </Link>
              ) : (
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg gradient-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
                >
                  Sign Up
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
