import { AlertCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { disableGuestMode } from "@/lib/guestMode";

interface GuestModeBannerProps {
  onClose?: () => void;
}

export default function GuestModeBanner({ onClose }: GuestModeBannerProps) {
  const handleExit = () => {
    disableGuestMode();
    window.location.href = "/";
  };

  return (
    <div className="bg-accent/10 border-b border-accent/30 px-4 py-3">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-foreground">Guest Mode - Demo Profile</p>
            <p className="text-muted-foreground">
              You're exploring with a demo profile. 
              <Link to="/signup" className="ml-1 font-semibold text-accent hover:underline">
                Create an account
              </Link>
              {" "}to save your own profile.
            </p>
          </div>
        </div>
        <button
          onClick={handleExit}
          className="rounded-lg p-1 text-muted-foreground hover:bg-accent/20 transition-colors"
          title="Exit guest mode"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
