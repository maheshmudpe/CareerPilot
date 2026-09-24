import { Bell, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router";

import { useAuth } from "@/app/auth/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Search className="h-4 w-4" />
        <span>Search applications...</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">
              {user?.email}
            </p>
            <p className="text-xs text-muted-foreground">
              CareerPilot user
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {user?.email?.charAt(0).toUpperCase()}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;