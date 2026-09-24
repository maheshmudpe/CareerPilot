import { Bell, Search } from "lucide-react";

function Header() {
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

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
          M
        </div>
      </div>
    </header>
  );
}

export default Header;