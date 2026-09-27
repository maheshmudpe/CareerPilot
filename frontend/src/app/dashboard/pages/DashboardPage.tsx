import { useEffect, useState } from "react";


import DashboardStats from "../components/DashboardStats";
import UpcomingInterviews from "../components/UpcomingInterviews";
import ApplicationsByStatus from "../components/ApplicationsByStatus";
import RecentApplications from "../components/RecentApplications";
import { getDashboard } from "../dashboard.service";
import type { DashboardResponse } from "../dashboard.schema";

const DashboardPage = () => {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getDashboard();

        setDashboard(data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        setError("Unable to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Track your applications, interviews, and job search progress.
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="text-sm text-muted-foreground">
          Loading dashboard...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Dashboard Content */}
      {dashboard && (
        <>
          <DashboardStats
            statistics={dashboard.statistics}
          />

          <div className="grid items-start gap-6 lg:grid-cols-2">
            <ApplicationsByStatus
              applicationsByStatus={dashboard.applicationsByStatus}
            />

            <UpcomingInterviews
              interviews={dashboard.upcomingInterviews}
            />
          </div>

          <RecentApplications
            applications={dashboard.recentApplications}
          />
        </>
      )}


    </div>
  );
};

export default DashboardPage;