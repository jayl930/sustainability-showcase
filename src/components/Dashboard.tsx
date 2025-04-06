
import { useState, useEffect, useMemo } from "react";
import { Article, DashboardStats } from "@/utils/types";
import {
  calculateStats,
  getUniqueValues,
  filterArticles,
} from "@/utils/csvParser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FilterBar from "./FilterBar";
import {
  BarChart3,
  FileText,
  Users,
  Goal,
  TrendingUp,
  BookOpen,
  Building,
} from "lucide-react";

// Import tab components
import OverviewTab from "./dashboard-tabs/OverviewTab";
import TrendsTab from "./dashboard-tabs/TrendsTab";
import GoalsTab from "./dashboard-tabs/GoalsTab";
import FacultyTab from "./dashboard-tabs/FacultyTab";
import DepartmentsTab from "./dashboard-tabs/DepartmentsTab";
import JournalsTab from "./dashboard-tabs/JournalsTab";
import DetailsTab from "./dashboard-tabs/DetailsTab";

interface DashboardProps {
  articles: Article[];
  className?: string;
}

const Dashboard = ({ articles, className }: DashboardProps) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("overview");

  useEffect(() => {
    if (articles.length > 0) {
      const businessArticles = articles.filter(
        (a) => a.general_business === "1"
      );

      const newStats = calculateStats(businessArticles);
      setStats(newStats);
      setFilteredArticles(businessArticles);

      setDepartments(getUniqueValues(articles, "department"));
      setYears(getUniqueValues(articles, "publication_year"));
    }
  }, [articles]);

  useEffect(() => {
    if (filteredArticles.length > 0) {
      const newStats = calculateStats(filteredArticles);
      setStats(newStats);
    }
  }, [filteredArticles]);

  const handleFilterChange = (
    department: string | null,
    yearRange: [string | null, string | null],
    goals: number[] | null,
    isSustainable: boolean | null,
    generalBusiness: boolean | null,
    topJournals: boolean | null
  ) => {
    console.log("Applying filters:", {
      department,
      yearRange,
      goals,
      isSustainable,
      generalBusiness,
      topJournals,
    });

    let filtered = [...articles];
    
    if (generalBusiness) {
      filtered = filtered.filter(a => a.general_business === "1");
    }

    if (topJournals) {
      filtered = filtered.filter(a => a.ut_dallas === "1" || a.financial_times === "1");
    }

    filtered = filterArticles(
      filtered,
      department,
      yearRange,
      goals,
      isSustainable
    );

    console.log(
      `Filtered articles: ${filtered.length} (from ${articles.length})`
    );
    setFilteredArticles(filtered);
  };

  if (!stats) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <FilterBar
          departments={departments}
          years={years}
          onFilterChange={handleFilterChange}
        />
      </div>

      <Tabs
        defaultValue="overview"
        className="mb-6"
        onValueChange={(value) => setCurrentTab(value)}
      >
        <TabsList className="grid grid-cols-7 mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-1">
            <Goal className="h-4 w-4" />
            <span className="hidden sm:inline">Sustainability Goals</span>
          </TabsTrigger>
          <TabsTrigger value="journals" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Journal Trends</span>
          </TabsTrigger>
          <TabsTrigger value="faculty" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Faculty</span>
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Departments</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Details</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <OverviewTab stats={stats} />
        </TabsContent>

        <TabsContent value="goals" className="pt-4">
          <GoalsTab stats={stats} />
        </TabsContent>

        <TabsContent value="journals" className="pt-4">
          <JournalsTab stats={stats} articles={filteredArticles} />
        </TabsContent>

        <TabsContent value="faculty" className="pt-4">
          <FacultyTab stats={stats} />
        </TabsContent>

        <TabsContent value="departments" className="pt-4">
          <DepartmentsTab stats={stats} />
        </TabsContent>

        <TabsContent value="trends" className="pt-4">
          <TrendsTab stats={stats} />
        </TabsContent>

        <TabsContent value="details" className="pt-4">
          <DetailsTab articles={filteredArticles} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
