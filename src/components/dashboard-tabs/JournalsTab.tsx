import { DashboardStats, Article } from "@/utils/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import JournalSustainabilityChart from "../charts/JournalSustainabilityChart";
import AnnualPublicationChart from "../charts/AnnualPublicationChart";
import GrowthRateChart from "../charts/GrowthRateChart";

interface JournalsTabProps {
  stats: DashboardStats;
  articles: Article[];
}

const JournalsTab = ({ stats, articles }: JournalsTabProps) => {
  // Recalculate journal metrics with more specific categories
  // UT Dallas journals
  const utDallasCount = articles.filter((a) => a.ut_dallas === "1").length;

  // Financial Times journals
  const financialTimesCount = articles.filter(
    (a) => a.financial_times === "1" && a.ut_dallas !== "1"
  ).length;

  // Regular business journals (General Business but not top journals)
  const regularBusinessCount = articles.filter(
    (a) =>
      a.general_business === "1" &&
      a.ut_dallas !== "1" &&
      a.financial_times !== "1"
  ).length;

  // Non-business journals
  const otherCount = articles.filter((a) => a.general_business !== "1").length;

  const journalDistributionData = [
    { name: "UT Dallas", value: utDallasCount },
    { name: "Financial Times", value: financialTimesCount },
    { name: "Business", value: regularBusinessCount },
    { name: "Non-Business", value: otherCount },
  ];

  return (
    <div className="space-y-6">
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in opacity-0"
        style={{ "--index": 4 } as React.CSSProperties}
      >
        {/* Journal Type Distribution - UPDATED */}
        <Card>
          <CardHeader>
            <CardTitle>Journal Type Distribution</CardTitle>
            <CardDescription>
              Article distribution by journal classification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={journalDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#F59E0B" /> {/* UT Dallas */}
                    <Cell fill="#EF4444" /> {/* Financial Times */}
                    <Cell fill="#3B82F6" /> {/* Business */}
                    <Cell fill="#6B7280" /> {/* Non-Business */}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `${value} articles`,
                      "Count",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Journal Sustainability Analysis</CardTitle>
            <CardDescription>
              Sustainability focus by journal classification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JournalSustainabilityChart
              journalData={[
                {
                  category: "UT Dallas",
                  sustainable: articles.filter(
                    (a) => a.ut_dallas === "1" && a.is_sustain === 1
                  ).length,
                  nonSustainable: articles.filter(
                    (a) => a.ut_dallas === "1" && a.is_sustain !== 1
                  ).length,
                },
                {
                  category: "Financial Times",
                  sustainable: articles.filter(
                    (a) =>
                      a.financial_times === "1" &&
                      a.ut_dallas !== "1" &&
                      a.is_sustain === 1
                  ).length,
                  nonSustainable: articles.filter(
                    (a) =>
                      a.financial_times === "1" &&
                      a.ut_dallas !== "1" &&
                      a.is_sustain !== 1
                  ).length,
                },
                {
                  category: "Business",
                  sustainable: articles.filter(
                    (a) =>
                      a.general_business === "1" &&
                      a.ut_dallas !== "1" &&
                      a.financial_times !== "1" &&
                      a.is_sustain === 1
                  ).length,
                  nonSustainable: articles.filter(
                    (a) =>
                      a.general_business === "1" &&
                      a.ut_dallas !== "1" &&
                      a.financial_times !== "1" &&
                      a.is_sustain !== 1
                  ).length,
                },
                {
                  category: "Non-Business",
                  sustainable: articles.filter(
                    (a) => a.general_business !== "1" && a.is_sustain === 1
                  ).length,
                  nonSustainable: articles.filter(
                    (a) => a.general_business !== "1" && a.is_sustain !== 1
                  ).length,
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Card
        className="animate-fade-in opacity-0"
        style={{ "--index": 0 } as React.CSSProperties}
      >
        <CardHeader>
          <CardTitle>Annual Publication Trend</CardTitle>
          <CardDescription>
            Total articles, top journal articles, and SDG relevant articles by
            year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnnualPublicationChart
            annualData={stats.annualTrends}
            showTopJournals={true}
          />
        </CardContent>
      </Card>

      {/* Second Row - Growth Rates, Total Articles */}
      <Card
        className="animate-fade-in opacity-0"
        style={{ "--index": 1 } as React.CSSProperties}
      >
        <CardHeader>
          <CardTitle>Total Articles Growth Rate</CardTitle>
          <CardDescription>
            Annual and 5-year rolling average growth rates for total articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={stats.annualTrends.filter(
                  (item) =>
                    parseInt(item.year) >= 2011 && // Convert string to number
                    item.growthRate !== undefined &&
                    item.growthRate !== null
                )}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${Math.round(value)}%`}
                  domain={[-100, 100]}
                  label={{
                    value: "Growth Rate (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${Math.round(value)}%`,
                    "Growth Rate",
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="growthRate"
                  name="Annual Growth"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="totalRollingGrowthRate"
                  name="5-Year Rolling Average"
                  stroke="#1D4ED8"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Third Row - Growth Rates, Top Journal Articles */}
      <Card
        className="animate-fade-in opacity-0"
        style={{ "--index": 2 } as React.CSSProperties}
      >
        <CardHeader>
          <CardTitle>Top Journal Articles Growth Rate</CardTitle>
          <CardDescription>
            Annual and 5-year rolling average growth rates for top journal
            articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={stats.annualTrends
                  .filter(
                    (item) =>
                      parseInt(item.year) >= 2011 &&
                      item.topJournalRollingGrowthRate !== undefined &&
                      item.topJournalRollingGrowthRate !== null
                  )
                  .map((item, index, array) => {
                    // Calculate annual growth rate by comparing with previous year
                    // if available in the array
                    let annualGrowthRate = 0;
                    if (index > 0 && array[index - 1].topJournalArticles > 0) {
                      const prevYearArticles =
                        array[index - 1].topJournalArticles;
                      const currentArticles = item.topJournalArticles;
                      annualGrowthRate =
                        ((currentArticles - prevYearArticles) /
                          prevYearArticles) *
                        100;
                    }

                    return {
                      ...item,
                      // Create a new property for annual growth
                      topJournalAnnualGrowthRate: Math.min(
                        Math.max(annualGrowthRate, -100),
                        100
                      ),
                      // Keep the rolling average
                      topJournalRollingGrowthRate: Math.min(
                        Math.max(item.topJournalRollingGrowthRate || 0, -100),
                        100
                      ),
                    };
                  })}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${Math.round(value)}%`}
                  domain={[-100, 100]}
                  label={{
                    value: "Growth Rate (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${Math.round(value)}%`,
                    "Growth Rate",
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="topJournalAnnualGrowthRate"
                  name="Annual Growth"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="topJournalRollingGrowthRate"
                  name="5-Year Rolling Average"
                  stroke="#B45309"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Fourth Row - Growth Rates, SDG Relevant Articles */}
      <Card
        className="animate-fade-in opacity-0"
        style={{ "--index": 3 } as React.CSSProperties}
      >
        <CardHeader>
          <CardTitle>SDG Relevant Articles Growth Rate</CardTitle>
          <CardDescription>
            Annual and 5-year rolling average growth rates for SDG relevant
            articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={stats.annualTrends
                  .filter(
                    (item) =>
                      parseInt(item.year) >= 2011 && // Convert string to number
                      item.sustainableGrowthRate !== undefined &&
                      item.sustainableGrowthRate !== null
                  )
                  .map((item) => ({
                    ...item,
                    sustainableGrowthRate: Math.min(
                      Math.max(item.sustainableGrowthRate || 0, -100),
                      100
                    ),
                    sustainableRollingGrowthRate: Math.min(
                      Math.max(item.sustainableRollingGrowthRate || 0, -100),
                      100
                    ),
                  }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${Math.round(value)}%`}
                  domain={[-100, 100]}
                  label={{
                    value: "Growth Rate (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${Math.round(value)}%`,
                    "Growth Rate",
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="sustainableGrowthRate"
                  name="Annual Growth"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="sustainableRollingGrowthRate"
                  name="5-Year Rolling Average"
                  stroke="#047857"
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

export default JournalsTab;
