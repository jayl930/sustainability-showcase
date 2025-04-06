import { DashboardStats } from "@/utils/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  BarChart,
} from "recharts";

interface TrendsTabProps {
  stats: DashboardStats;
}

const TrendsTab = ({ stats }: TrendsTabProps) => {
  const getChartColor = (entry: any): string => {
    if (entry.growthRate && entry.growthRate >= 0) {
      return "#10B981";
    }
    return "#EF4444";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Multi-Line Chart: Total vs Sustainable */}
      <Card
        className="md:col-span-2 animate-fade-in opacity-0"
        style={{ "--index": 0 } as React.CSSProperties}
      >
        <CardHeader>
          <CardTitle>Publication Trends Over Time</CardTitle>
          <CardDescription>
            Annual counts for total publications and sustainability publications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={stats.annualTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Publication Year",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "Articles",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} articles`, "Count"]}
                />
                <Legend />
                <Bar
                  dataKey="totalArticles"
                  fill="#3B82F6"
                  name="Total Articles"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Line
                  type="monotone"
                  dataKey="sustainableArticles"
                  name="Sustainable Articles"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stacked Bar Chart: Journal Type by Year */}
      <Card
        className="md:col-span-2 animate-fade-in opacity-0"
        style={{ "--index": 1 } as React.CSSProperties}
      >
        <CardHeader>
          <CardTitle>Publication by Journal Classification</CardTitle>
          <CardDescription>
            Annual publication counts segmented by journal type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.annualTrends}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value} articles`, "Count"]}
                />
                <Legend />
                <Bar
                  dataKey="generalBusiness"
                  stackId="a"
                  name="General Business"
                  fill="#3B82F6"
                />
                <Bar
                  dataKey="utDallas"
                  stackId="a"
                  name="UT Dallas"
                  fill="#10B981"
                />
                <Bar
                  dataKey="financialTimes"
                  stackId="a"
                  name="Financial Times"
                  fill="#F59E0B"
                />
                <Bar dataKey="other" stackId="a" name="Other" fill="#6B7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Growth Rate Chart - Fixed Y-axis and formatting */}
      <Card
        className="md:col-span-2 animate-fade-in opacity-0"
        style={{ "--index": 2 } as React.CSSProperties}
      >
        <CardHeader>
          <CardTitle>Annual Growth Rates</CardTitle>
          <CardDescription>
            Year-over-year percentage changes in publication counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={stats.annualTrends.filter(
                  (item) => item.growthRate !== undefined
                )}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                  domain={["auto", "auto"]}
                  label={{
                    value: "Growth Rate (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${value.toFixed(2)}%`,
                    "Growth",
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="growthRate"
                  name="Total Articles Growth"
                  radius={[4, 4, 0, 0]}
                >
                  {stats.annualTrends
                    .filter((item) => item.growthRate !== undefined)
                    .map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getChartColor(entry)} />
                    ))}
                </Bar>
                <Line
                  type="monotone"
                  dataKey="sustainableGrowthRate"
                  name="Sustainable Articles Growth"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="topJournalGrowthRate"
                  name="Top Journal Articles Growth"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsTab;
