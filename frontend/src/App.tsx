import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { getCurrentUser } from "@/lib/auth";
import Navbar from "./components/Navbar";
import CompanyNavbar from "./components/CompanyNavbar";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import LearningRoadmapPage from "./pages/LearningRoadmapPage";
import Opportunities from "./pages/Opportunities";
import Search from "./pages/Search";
import Messaging from "./pages/Messaging";
import NotFound from "./pages/NotFound";
import CompanyVerification from "./pages/CompanyVerification";
import CompanySignUp from "./pages/CompanySignUp";
import CompanySignIn from "./pages/CompanySignIn";
import CompanyDashboard from "./pages/CompanyDashboard";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const currentUser = useMemo(() => getCurrentUser(), []);
  
  // Define routes where NO Navbar should be visible
  const noNavbarRoutes = [
    "/", "/signup", "/signin", "/profile", 
    "/company-verification", "/company-signup", "/company-signin"
  ];
  
  const isNoNavbarRoute = noNavbarRoutes.includes(location.pathname);
  const isCompanyRoute = location.pathname.startsWith("/company/");
  const isCompanyDashboard = location.pathname === "/company-dashboard";

  return (
    <>
      {!isNoNavbarRoute && (
        isCompanyRoute || isCompanyDashboard ? <CompanyNavbar /> : <Navbar />
      )}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile" element={<ProfileSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmap" element={<LearningRoadmapPage />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/company-verification" element={<CompanyVerification />} />
        <Route path="/company-signup" element={<CompanySignUp />} />
        <Route path="/company-signin" element={<CompanySignIn />} />
        
        {/* New Company Routes */}
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/post-job" element={<CompanyDashboard />} />
        <Route path="/company/manage-jobs" element={<CompanyDashboard />} />
        <Route path="/company/applicants" element={<CompanyDashboard />} />
        <Route path="/company/resumes" element={<CompanyDashboard />} />
        
        <Route path="/search" element={<Search />} />
        <Route path="/messages" element={<Messaging />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
