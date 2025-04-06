import { useState, useEffect } from "react";
import { DashboardStats } from "@/utils/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TopFacultyBarChart from "../charts/TopFacultyBarChart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GOAL_COLORS } from "../charts/GoalDistributionChart";

interface FacultyTabProps {
  stats: DashboardStats;
}

const ITEMS_PER_PAGE = 10;

const FacultyTab = ({ stats }: FacultyTabProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);

  // Get available goals with contributors
  const availableGoals = stats.goalContributors
    .map((gc) => gc.goal)
    .sort((a, b) => a - b);

  // Initialize with the first goal that has contributors
  useEffect(() => {
    if (availableGoals.length > 0 && selectedGoal === null) {
      setSelectedGoal(availableGoals[0]);
    }
  }, [availableGoals, selectedGoal]);

  // Get current goal contributors
  const currentGoalContributors =
    stats.goalContributors.find((gc) => gc.goal === selectedGoal)
      ?.contributors || [];

  // Handle pagination
  const totalPages = Math.max(
    1,
    Math.ceil(currentGoalContributors.length / ITEMS_PER_PAGE)
  );
  const paginatedContributors = currentGoalContributors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when goal changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGoal]);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Tab for different faculty rankings */}
      <Tabs defaultValue="total" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="total">Highest Business Articles</TabsTrigger>
          <TabsTrigger value="topJournal">
            Highest Top Journal Articles
          </TabsTrigger>
          <TabsTrigger value="sustainable">Highest SDG Articles</TabsTrigger>
        </TabsList>

        {/* Tab 1: Faculty with Highest Business Articles */}
        <TabsContent value="total" className="space-y-6">
          <Card
            className="animate-fade-in opacity-0"
            style={{ "--index": 0 } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Top Faculty by Total Business Articles</CardTitle>
              <CardDescription>
                Faculty members with the highest number of business publications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopFacultyBarChart facultyData={stats.topFaculty} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Faculty with Highest Top Journal Articles */}
        <TabsContent value="topJournal" className="space-y-6">
          <Card
            className="animate-fade-in opacity-0"
            style={{ "--index": 0 } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Top Faculty by Top Journal Articles</CardTitle>
              <CardDescription>
                Faculty members with the highest number of publications in top
                journals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopFacultyBarChart facultyData={stats.topJournalFaculty} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Faculty with Highest SDG Articles */}
        <TabsContent value="sustainable" className="space-y-6">
          <Card
            className="animate-fade-in opacity-0"
            style={{ "--index": 0 } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle>Top Faculty by SDG Articles</CardTitle>
              <CardDescription>
                Faculty members with the highest number of
                sustainability-related publications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopFacultyBarChart facultyData={stats.topSustainableFaculty} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* UN SDG Goals Contributors */}
      <Card
        className="animate-fade-in opacity-0"
        style={{ "--index": 1 } as React.CSSProperties}
      >
        <CardHeader>
          <CardTitle>UN SDG Goal Contributors</CardTitle>
          <CardDescription>
            Top contributing faculty members for each UN Sustainable Development
            Goal
          </CardDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            {availableGoals.map((goal) => (
              <Button
                key={goal}
                size="sm"
                className={`flex items-center justify-center p-3 h-16 w-16 border-2 ${
                  selectedGoal === goal
                    ? "text-white border-transparent"
                    : "border-input bg-white hover:bg-white"
                }`}
                onClick={() => setSelectedGoal(goal)}
                style={
                  selectedGoal === goal
                    ? { backgroundColor: GOAL_COLORS[goal - 1] || "#3B82F6" }
                    : undefined
                }
              >
                <img
                  src={`${
                    selectedGoal === goal
                      ? `/SDG_ICON_filled/Goal${
                          goal < 10 ? "0" + goal : goal
                        }.png`
                      : `/SDG_ICON/Goal${goal < 10 ? "0" + goal : goal}.png`
                  }`}
                  alt={`Goal ${goal}`}
                  className="w-12 h-12 object-contain"
                />
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faculty Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">SDG Articles Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContributors.map((contributor, index) => (
                <TableRow key={`${contributor.name}-${index}`}>
                  <TableCell className="font-medium">
                    {contributor.name}
                  </TableCell>
                  <TableCell>{contributor.department}</TableCell>
                  <TableCell className="text-right">
                    {contributor.count}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {currentGoalContributors.length > ITEMS_PER_PAGE && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyTab;
