import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ApplicationsByStatusProps {
  applicationsByStatus: {
    SAVED: number;
    APPLIED: number;
    SCREENING: number;
    INTERVIEW: number;
    OFFER: number;
    ACCEPTED: number;
    REJECTED: number;
    WITHDRAWN: number;
  };
}

const ApplicationsByStatus = ({
  applicationsByStatus,
}: ApplicationsByStatusProps) => {
  const data = Object.entries(applicationsByStatus).map(
    ([status, count]) => ({
      status,
      count,
    }),
  );

  const totalApplications = Object.values(
    applicationsByStatus,
  ).reduce((total, count) => total + count, 0);

  const maxCount = Math.max(
    ...Object.values(applicationsByStatus),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications by Status</CardTitle>
      </CardHeader>

      <CardContent>
        {totalApplications === 0 ? (
          <div className="flex h-[240px] flex-col items-center justify-center text-center">
            <p className="text-sm font-medium">
              No applications yet
            </p>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Start tracking your applications to see your
              job search pipeline here.
            </p>
          </div>
        ) : (
          <div className="h-[240px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 10,
                }}
              >
                <CartesianGrid vertical={false} />

                <XAxis
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  allowDecimals={false}
                  domain={[0, Math.max(maxCount, 1)]}
                  tickCount={Math.min(maxCount + 1, 5)}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationsByStatus;