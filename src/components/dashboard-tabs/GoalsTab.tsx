import { DashboardStats } from "@/utils/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DetailedGoalChart from "../charts/DetailedGoalChart";
import { GOAL_COLORS } from "../charts/GoalDistributionChart";
import GoalDistributionChart from "../charts/GoalDistributionChart";
import TopGoalsChart from "../charts/TopGoalsChart";
import {
  RadialBarChart,
  RadialBar,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";
import { useState } from "react";
import SDGIcon from "../SDGIcon";
import SDGIconFilled from "../SDGIconFilled";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GoalsTabProps {
  stats: DashboardStats;
}

const GoalsTab = ({ stats }: GoalsTabProps) => {
  const [activeGoal, setActiveGoal] = useState<number | null>(null);
  const [coOccurrencePage, setCoOccurrencePage] = useState(0);

  const detailedGoalData = stats.detailedGoalDistribution.map((item) => ({
    goal: `Goal ${item.goal}`,
    top1: item.top1Count,
    top2: item.top2Count,
    top3: item.top3Count,
    total: item.totalCount,
    goalNumber: item.goal,
  }));

  // Format data for goals per article pie chart
  const goalsPerArticleData = stats.goalMetrics
    ? [
        {
          name: "1 Goal",
          value: stats.goalMetrics.goalsPerArticle[1],
          fill: "#4C9F38",
        },
        {
          name: "2 Goals",
          value: stats.goalMetrics.goalsPerArticle[2],
          fill: "#FCC30B",
        },
        {
          name: "3 Goals",
          value: stats.goalMetrics.goalsPerArticle[3],
          fill: "#E5243B",
        },
      ]
    : [];

  // Top co-occurring goals pairs
  const topCoOccurrences = stats.goalMetrics?.coOccurrence.slice(0, 10) || [];

  // Format data for top goals and fastest growing goals
  const topGoalsData =
    stats.goalMetrics?.overallFrequency
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((item) => ({
        goal: item.goal,
        count: item.count,
      })) || [];

  // Create sample growing goals data (should be replaced with actual data)
  // This should come from departmentStats[].growingSDGGoals
  const fastestGrowingGoals =
    stats.departmentStats
      ?.flatMap((dept) => dept.growingSDGGoals)
      .sort((a, b) => b.growthRate - a.growthRate)
      .slice(0, 3) || [];

  // Calculate the items to display based on the current page
  const itemsPerPage = 3;
  const totalPages = Math.ceil(topCoOccurrences.length / itemsPerPage);
  const displayedCoOccurrences = topCoOccurrences.slice(
    coOccurrencePage * itemsPerPage,
    (coOccurrencePage + 1) * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* First Row - UN Goals Distribution */}
      <Card
        className="animate-fade-in opacity-0"
        style={{ "--index": 0 } as React.CSSProperties}
      >
        <CardHeader>
          <CardTitle>UN Sustainable Development Goals Distribution</CardTitle>
          <CardDescription>
            Total mentions of each UN SDG across all articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px]">
            <GoalDistributionChart
              goalData={stats.goalDistribution}
              fullWidth={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Second Row - Detailed Sustainability Goal Distribution */}
      <Card
        className="animate-fade-in opacity-0"
        style={{ "--index": 1 } as React.CSSProperties}
      >
        <CardHeader>
          <CardTitle>Detailed Sustainability Goal Distribution</CardTitle>
          <CardDescription>
            Article counts by primary (top 1), secondary (top 2), and tertiary
            (top 3) goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DetailedGoalChart detailedGoalData={detailedGoalData} />
        </CardContent>
      </Card>

      {/* Third Row - Top Goals and Fastest Growing Goals */}
      <div
        className="animate-fade-in opacity-0"
        style={{ "--index": 2 } as React.CSSProperties}
      >
        <TopGoalsChart
          topGoals={topGoalsData}
          fastestGrowingGoals={fastestGrowingGoals}
        />
      </div>

      {/* Fourth Row - Goals per Article and Co-occurrences */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in opacity-0"
        style={{ "--index": 3 } as React.CSSProperties}
      >
        {/* Goals per Article Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Goals per Article</CardTitle>
            <CardDescription>
              Distribution of articles mentioning 1, 2, or 3 sustainability
              goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalsPerArticleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {goalsPerArticleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `${value} articles`,
                      "Count",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Co-occurring Goals - Grid Visualization with Pagination */}
        <Card>
          <CardHeader>
            <CardTitle>Top Goal Co-occurrences</CardTitle>
            <CardDescription>
              Most frequent pairs of sustainability goals appearing together in
              articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {displayedCoOccurrences.map((pair, index) => (
                <div key={index} className="flex items-center gap-6">
                  <div className="w-24 h-20 flex-shrink-0 flex items-center justify-center z-10 bg-white">
                    <div className="flex items-center">
                      <img
                        src={`/SDG_ICON_filled/Goal${
                          pair.goal1 < 10 ? "0" + pair.goal1 : pair.goal1
                        }.png`}
                        alt={`Goal ${pair.goal1}`}
                        className="w-10 h-10 object-contain"
                      />
                      <span className="mx-2 text-lg font-medium">+</span>
                      <img
                        src={`/SDG_ICON_filled/Goal${
                          pair.goal2 < 10 ? "0" + pair.goal2 : pair.goal2
                        }.png`}
                        alt={`Goal ${pair.goal2}`}
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1 ml-2">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">
                        Goals {pair.goal1} & {pair.goal2}
                      </h4>
                      <span className="text-sm font-semibold">
                        {pair.count} articles
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${
                            (pair.count /
                              Math.max(
                                ...topCoOccurrences.map((p) => p.count)
                              )) *
                            100
                          }%`,
                          background: `linear-gradient(to right, ${
                            GOAL_COLORS[pair.goal1 - 1] || "#3B82F6"
                          }, ${GOAL_COLORS[pair.goal2 - 1] || "#3B82F6"})`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {topCoOccurrences.length > itemsPerPage && (
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() =>
                    setCoOccurrencePage((prev) => Math.max(0, prev - 1))
                  }
                  disabled={coOccurrencePage === 0}
                  className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-500">
                  Page {coOccurrencePage + 1} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCoOccurrencePage((prev) =>
                      Math.min(totalPages - 1, prev + 1)
                    )
                  }
                  disabled={coOccurrencePage === totalPages - 1}
                  className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalsTab;
