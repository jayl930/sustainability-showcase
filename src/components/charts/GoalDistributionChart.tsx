import {
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";
import SDGIcon, { getSDGColor, getSDGName } from "@/components/SDGIcon";
import { useState } from "react";

interface GoalData {
  goal: number;
  count: number;
  goalNumber?: number;
}

interface GoalDistributionChartProps {
  goalData: GoalData[];
  fullWidth?: boolean;
}

const GOAL_COLORS = [
  "#E5243B",
  "#DDA63A",
  "#4C9F38",
  "#C5192D",
  "#FF3A21",
  "#26BDE2",
  "#FCC30B",
  "#A21942",
  "#FD6925",
  "#DD1367",
  "#FD9D24",
  "#BF8B2E",
  "#3F7E44",
  "#0A97D9",
  "#56C02B",
  "#00689D",
  "#19486A",
];

const GoalDistributionChart = ({
  goalData,
  fullWidth = false,
}: GoalDistributionChartProps) => {
  const [activeGoal, setActiveGoal] = useState<number | null>(null);

  if (!goalData || goalData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">
          No sustainability goal data available
        </p>
      </div>
    );
  }

  // Sort data by goal number to ensure proper ordering on X-axis
  const sortedData = [...goalData].sort((a, b) => {
    const aGoal = a.goalNumber || a.goal;
    const bGoal = b.goalNumber || b.goal;
    return aGoal - bGoal;
  });

  // Enrich data with SDG goal names
  const enrichedData = sortedData.map((item) => ({
    ...item,
    name: getSDGName(item.goalNumber || item.goal),
  }));

  // Custom label for bars that include only the SDG icons (no count)
  const CustomBarLabel = (props: any) => {
    const { x, y, width, index } = props;
    const entry = enrichedData[index];
    const goalNum = entry.goalNumber || entry.goal;

    // Calculate icon size based on bar width (slightly smaller to add some padding)
    const iconWidth = Math.max(width - 4, 30); // Minimum size of 30px

    return (
      <g>
        {/* SDG Icon */}
        <foreignObject
          x={x + (width - iconWidth) / 2}
          y={y - iconWidth - 10}
          width={iconWidth}
          height={iconWidth}
          style={{ overflow: "visible" }} // Ensure the icon doesn't get clipped
        >
          <div
            className="flex justify-center items-center h-full"
            style={{ pointerEvents: "none" }} // This prevents hover issues
          >
            <SDGIcon goalNumber={goalNum} size={iconWidth} />
          </div>
        </foreignObject>
      </g>
    );
  };

  // Custom axis labels with SDG icons
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;

    // Handle both string and number values
    const goalNum =
      typeof payload.value === "string"
        ? parseInt(payload.value.replace(/\D/g, "")) // Extract number from string
        : payload.value;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} fontSize={12} textAnchor="middle" fill="#666">
          {`Goal ${goalNum}`}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={enrichedData}
          margin={{ top: 80, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis
            dataKey="goal"
            tickFormatter={(value) => {
              // Ensure we display "Goal X" format
              return typeof value === "number"
                ? `Goal ${value}`
                : `Goal ${value}`;
            }}
            height={50}
            tick={CustomXAxisTick}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => [`${value} articles`, "Count"]}
            labelFormatter={(label) => {
              const goalNum =
                typeof label === "number" ? label : parseInt(label.toString());
              return `Goal ${goalNum}: ${getSDGName(goalNum)}`;
            }}
            cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} // Semi-transparent hover effect
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {enrichedData.map((entry, index) => {
              // Use entry.goal if goalNumber isn't provided
              const goalNum = entry.goalNumber || entry.goal;
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={GOAL_COLORS[goalNum - 1] || "#3B82F6"}
                />
              );
            })}
            <LabelList content={<CustomBarLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GoalDistributionChart;
export { GOAL_COLORS };
