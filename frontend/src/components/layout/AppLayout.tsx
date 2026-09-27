import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;