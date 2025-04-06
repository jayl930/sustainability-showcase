import { useState } from "react";
import { DashboardStats } from "@/utils/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SDGIcon from "../SDGIcon";
import SDGIconFilled from "../SDGIconFilled";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GOAL_COLORS } from "../charts/GoalDistributionChart";

interface DepartmentsTabProps {
  stats: DashboardStats;
}

// Define the departments we want to show
const INCLUDED_DEPARTMENTS = [
  "Business Administration",
  "Accountancy",
  "Finance",
];

// Define department colors
const DEPARTMENT_COLORS = {
  "Business Administration": "#3B82F6", // blue
  Accountancy: "#10B981", // green
  Finance: "#F59E0B", // amber
};

const DepartmentsTab = ({ stats }: DepartmentsTabProps) => {
  // Filter to only include specific departments
  const filteredDepartments = stats.departmentStats
    .filter((dept) => INCLUDED_DEPARTMENTS.includes(dept.department))
    .map((dept) => ({
      ...dept,
      color:
        DEPARTMENT_COLORS[dept.department as keyof typeof DEPARTMENT_COLORS] ||
        "#6B7280",
    }));

  // Format data for the bar chart
  const departmentChartData = filteredDepartments.map((dept) => ({
    department: dept.department,
    totalArticles: dept.totalArticles,
    sustainableArticles: dept.sustainableArticles,
    topJournalArticles: dept.topJournalArticles,
    color: dept.color,
  }));

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Top Departments by Publication */}
      <Card
        className="animate-fade-in opacity-0"
        style={{ "--index": 0 } as React.CSSProperties}
      >
        <CardHeader>
          <CardTitle>Top Departments by Publication</CardTitle>
          <CardDescription>
            Publication metrics for key business departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentChartData}
                layout="vertical"
                margin={{ left: 150, right: 20, top: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis type="number" />
                <YAxis type="category" dataKey="department" width={140} />
                <Tooltip
                  formatter={(value: number) => [`${value} articles`, "Count"]}
                />
                <Legend />
                <Bar
                  dataKey="totalArticles"
                  name="Research Articles"
                  fill="#3B82F6"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="topJournalArticles"
                  name="Top Journal Articles"
                  fill="#F59E0B"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="sustainableArticles"
                  name="SDG Articles"
                  fill="#10B981"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Department-specific SDG Goals */}
      <Tabs defaultValue="accountancy" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="accountancy">Accountancy</TabsTrigger>
          <TabsTrigger value="business">Business Administration</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
        </TabsList>

        {filteredDepartments.map((dept) => {
          // Determine which TabsContent to use based on department name
          let tabValue = "";
          switch (dept.department) {
            case "Accountancy":
              tabValue = "accountancy";
              break;
            case "Business Administration":
              tabValue = "business";
              break;
            case "Finance":
              tabValue = "finance";
              break;
            default:
              return null;
          }

          return (
            <TabsContent key={tabValue} value={tabValue} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top SDG Goals - Updated Design */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top SDG Goals</CardTitle>
                    <CardDescription>
                      Most frequent sustainability goals in {dept.department}{" "}
                      research
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {dept.departmentSDGGoals
                        .slice(0, 3)
                        .map((goal, index) => (
                          <div key={index} className="flex items-center gap-6">
                            <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
                              <SDGIconFilled goalNumber={goal.goal} size={32} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">
                                  Goal {goal.goal}
                                </h4>
                                <span className="text-sm font-semibold">
                                  {goal.count} articles
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div
                                  className="h-2.5 rounded-full"
                                  style={{
                                    width: `${
                                      (goal.count /
                                        Math.max(
                                          ...dept.departmentSDGGoals.map(
                                            (g) => g.count
                                          )
                                        )) *
                                      100
                                    }%`,
                                    backgroundColor:
                                      GOAL_COLORS[goal.goal - 1] || "#3B82F6",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      {dept.departmentSDGGoals.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                          No SDG goals data for this department
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Fastest Growing SDG Goals - Updated Design */}
                <Card>
                  <CardHeader>
                    <CardTitle>Fastest Growing SDG Goals</CardTitle>
                    <CardDescription>
                      SDG goals with highest growth rate in {dept.department}{" "}
                      research
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {dept.growingSDGGoals.slice(0, 3).map((goal, index) => (
                        <div key={index} className="flex items-center gap-6">
                          <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
                            <SDGIconFilled goalNumber={goal.goal} size={32} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">Goal {goal.goal}</h4>
                              <span className="text-sm font-semibold text-emerald-600">
                                +{goal.growthRate.toFixed(0)}% growth
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                              <div
                                className="h-2.5 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (goal.growthRate / 100) * 100,
                                    100
                                  )}%`,
                                  backgroundColor:
                                    GOAL_COLORS[goal.goal - 1] || "#3B82F6",
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {dept.growingSDGGoals.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                          No growth data available for this department
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default DepartmentsTab;
