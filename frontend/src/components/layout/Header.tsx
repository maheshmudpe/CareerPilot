import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router";

import { useAuth } from "@/app/auth/AuthContext";
import { useState } from "react";


interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
   <header className="flex h-16 items-center justify-between border-b bg-background px-6 md:justify-end">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setUserMenuOpen((open) => !open)}
          className="flex items-center gap-3 rounded-md p-1.5 transition-colors hover:bg-muted"
          aria-expanded={userMenuOpen}
          aria-haspopup="menu"
        >
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">
              {user?.email?.split("@")[0]}
            </p>
            <p className="text-xs text-muted-foreground">
              CareerPilot
            </p>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </button>

        {userMenuOpen && (
          <div
            className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border bg-background p-1 shadow-md"
            role="menu"
          >
            <button
              type="button"
              onClick={() => {
                setUserMenuOpen(false);
                navigate("/profile");
              }}
              className="flex w-full items-center rounded-sm px-3 py-2 text-sm hover:bg-muted"
              role="menuitem"
            >
              Profile
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center rounded-sm px-3 py-2 text-sm text-destructive hover:bg-muted"
              role="menuitem"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </button>
          </div>
        )}
      </div>
    </header >
  );
}

export default Header;