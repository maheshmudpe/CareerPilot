import {
  BriefcaseBusiness,
  CalendarDays,
  CircleCheck,
  CircleX,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardStatsProps {
  statistics: {
    totalApplications: number;
    totalInterviews: number;
    offers: number;
    rejected: number;
  };
}

const DashboardStats = ({
  statistics,
}: DashboardStatsProps) => {
  const stats = [
    {
      title: "Total Applications",
      value: statistics.totalApplications,
      icon: BriefcaseBusiness,
    },
    {
      title: "Total Interviews",
      value: statistics.totalInterviews,
      icon: CalendarDays,
    },
    {
      title: "Offers",
      value: statistics.offers,
      icon: CircleCheck,
    },
    {
      title: "Rejected",
      value: statistics.rejected,
      icon: CircleX,
    },
  ];

  

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>

              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">
                {stat.value}
              </div>
            </CardContent>
          </Card>






        );
      })}


      
    </div>
    

    
  );
};


export default DashboardStats;