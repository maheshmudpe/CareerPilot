import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  LayoutDashboard,
  User,
} from "lucide-react";

import { NavLink } from "react-router";

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

function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <div>
          <h1 className="text-lg font-semibold">CareerPilot</h1>
          <p className="text-xs text-muted-foreground">
            Career command center
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
                <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
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

      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Track your progress
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;