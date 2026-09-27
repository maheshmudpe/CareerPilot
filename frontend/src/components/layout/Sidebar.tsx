import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  LayoutDashboard,
  User,
} from "lucide-react";

import { Link, NavLink } from "react-router";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Applications",
    href: "/applications",
    icon: BriefcaseBusiness,
  },
  {
    name: "Companies",
    href: "/companies",
    icon: Building2,
  },
  {
    name: "Interviews",
    href: "/interviews",
    icon: CalendarDays,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r bg-background transition-transform duration-200 md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      <div className="flex h-16 items-center border-b px-6">
        <Link
          to="/dashboard"
          className="rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <h1 className="text-lg font-semibold">CareerPilot</h1>

          <p className="text-xs text-muted-foreground">
            Career command center
          </p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>

       {open && (
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 md:hidden"
      />
    )}

    </>
  );
}

export default Sidebar;