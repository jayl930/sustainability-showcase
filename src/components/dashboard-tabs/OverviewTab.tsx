import { DashboardStats } from "@/utils/types";
import StatCard from "@/components/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  FileText,
  Goal,
  Users,
  Building2,
  BookOpen,
  Award,
  Verified,
  Heart,
  Zap,
  BarChart3,
} from "lucide-react";
import SustainabilityDistributionChart from "../charts/SustainabilityDistributionChart";
import FacultyEngagementPieChart from "../charts/FacultyEngagementPieChart";
import GoalDistributionChart from "../charts/GoalDistributionChart";
import AnnualPublicationChart from "../charts/AnnualPublicationChart";
import { getSDGColor } from "@/components/SDGIcon";

interface OverviewTabProps {
  stats: DashboardStats;
}

const OverviewTab = ({ stats }: OverviewTabProps) => {
  // Make sure we have proper data for the goal chart
  const goalBarData = stats.goalDistribution.map((item) => ({
    goal: item.goal,
    count: item.count,
    goalNumber: item.goal,
  }));

  // Get year range for display
  const yearRange =
    stats.annualTrends.length > 0
      ? `${stats.annualTrends[0]?.year || "N/A"} - ${
          stats.annualTrends[stats.annualTrends.length - 1]?.year || "N/A"
        }`
      : "N/A";

  return (
    <>
      {/* First Row - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          title="Year Range"
          value={yearRange}
          icon={<Calendar className="h-4 w-4" />}
          index={0}
        />
        <StatCard
          title="Total Research Articles"
          value={stats.totalArticles}
          icon={<FileText className="h-4 w-4" />}
          index={1}
        />
        <StatCard
          title="SDG Relevant Articles"
          value={stats.sustainableArticles}
          description={`${Math.round(stats.sustainabilityRatio)}% of total`}
          icon={<Goal className="h-4 w-4" />}
          index={2}
        />
        <StatCard
          title="Articles in Top Journals"
          value={stats.topJournalArticles}
          description={`${Math.round(
            (stats.topJournalArticles / stats.totalArticles) * 100
          )}% of total`}
          icon={<Award className="h-4 w-4" />}
          index={3}
        />
        <StatCard
          title="SDG Articles in Top Journals"
          value={stats.sustainableTopJournalArticles}
          description={`${Math.round(
            (stats.sustainableTopJournalArticles / stats.sustainableArticles) *
              100
          )}% of SDG articles`}
          icon={<Verified className="h-4 w-4" />}
          index={4}
        />
      </div>

      {/* Second Row - Faculty Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={<Building2 className="h-4 w-4" />}
          index={5}
        />
        <StatCard
          title="Faculty Members"
          value={stats.totalFaculty}
          icon={<Users className="h-4 w-4" />}
          index={6}
        />
        <StatCard
          title="Engaging Faculty"
          value={stats.engagingFaculty}
          description={`${Math.round(
            stats.facultyEngagementRatio
          )}% of faculty`}
          icon={<Heart className="h-4 w-4" />}
          index={7}
        />
        <StatCard
          title="Avg Articles / Faculty"
          value={stats.avgArticlesPerFaculty.toFixed(1)}
          icon={<BarChart3 className="h-4 w-4" />}
          index={8}
        />
        <StatCard
          title="Avg Top Articles / Faculty"
          value={stats.avgTopJournalArticlesPerFaculty.toFixed(1)}
          icon={<Award className="h-4 w-4" />}
          index={9}
        />
        <StatCard
          title="Avg SDG Articles / Faculty"
          value={stats.avgSustainableArticlesPerFaculty.toFixed(1)}
          icon={<Zap className="h-4 w-4" />}
          index={10}
        />
      </div>

      {/* Third Row - Proportion Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Sustainability Donut Chart */}
        <Card
          className="animate-fade-in opacity-0"
          style={{ "--index": 11 } as React.CSSProperties}
        >
          <CardHeader>
            <CardTitle>Proportion of SDG Relevant Articles</CardTitle>
            <CardDescription>
              The proportion of articles that align with UN sustainability goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SustainabilityDistributionChart
              sustainableArticles={stats.sustainableArticles}
              totalArticles={stats.uniqueArticles}
            />
          </CardContent>
        </Card>

        {/* Faculty Engagement Comparison */}
        <Card
          className="animate-fade-in opacity-0"
          style={{ "--index": 12 } as React.CSSProperties}
        >
          <CardHeader>
            <CardTitle>Proportion of Faculty Engaged in SDG Research</CardTitle>
            <CardDescription>
              Percentage of faculty contributing to sustainability publications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FacultyEngagementPieChart
              totalFaculty={stats.totalFaculty}
              engagingFaculty={stats.engagingFaculty}
            />
          </CardContent>
        </Card>
      </div>

      {/* Fourth Row - UN Goals Distribution */}
      <Card
        className="animate-fade-in opacity-0 mb-6"
        style={{ "--index": 13 } as React.CSSProperties}
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

      {/* Fifth Row - Annual Publication Trend */}
      <Card
        className="animate-fade-in opacity-0"
        style={{ "--index": 14 } as React.CSSProperties}
      >
        <CardHeader>
          <CardTitle>Annual Publication Trend</CardTitle>
          <CardDescription>
            Comparison of total, top journal, and SDG relevant articles by year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnnualPublicationChart
            annualData={stats.annualTrends}
            showTopJournals={true}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default OverviewTab;
