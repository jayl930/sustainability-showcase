import SDGIconFilled from "../SDGIconFilled";
import { getSDGName, getSDGColor } from "../SDGIcon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TopGoalItem {
  goal: number;
  count: number;
}

interface GrowingGoalItem {
  goal: number;
  growthRate: number;
}

interface TopGoalsChartProps {
  topGoals: TopGoalItem[];
  fastestGrowingGoals: GrowingGoalItem[];
}

const TopGoalsChart = ({
  topGoals,
  fastestGrowingGoals,
}: TopGoalsChartProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top 3 UN Goals in Research Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Top 3 UN Goals in Research Articles</CardTitle>
          <CardDescription>
            Most frequently mentioned sustainability goals across all research
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {topGoals.map((goal, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 h-16 flex-shrink-0">
                  <SDGIconFilled goalNumber={goal.goal} size={64} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium text-sm">
                      Goal {goal.goal}: {getSDGName(goal.goal)}
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
                            Math.max(...topGoals.map((g) => g.count))) *
                          100
                        }%`,
                        backgroundColor: getSDGColor(goal.goal),
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fastest Growing UN Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Fastest Growing UN Goals</CardTitle>
          <CardDescription>
            Sustainability goals with the highest growth rate in recent
            publications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {fastestGrowingGoals.map((goal, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 h-16 flex-shrink-0">
                  <SDGIconFilled goalNumber={goal.goal} size={64} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium text-sm">
                      Goal {goal.goal}: {getSDGName(goal.goal)}
                    </h4>
                    <span className="text-sm font-semibold">
                      {goal.growthRate > 10
                        ? `+${goal.growthRate.toFixed(0)}% growth`
                        : `+${(goal.growthRate * 100).toFixed(2)}% growth`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${
                          (goal.growthRate /
                            Math.max(
                              ...fastestGrowingGoals.map((g) => g.growthRate)
                            )) *
                          100
                        }%`,
                        backgroundColor: getSDGColor(goal.goal),
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopGoalsChart;
