import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { GOAL_COLORS } from "./GoalDistributionChart";
import SDGIcon from "@/components/SDGIcon";
import SDGIconFilled from "../SDGIconFilled";

interface DetailedGoalData {
  goal: string;
  top1: number;
  top2: number;
  top3: number;
  total: number;
  goalNumber: number;
}

interface DetailedGoalChartProps {
  detailedGoalData: DetailedGoalData[];
}

const DetailedGoalChart = ({ detailedGoalData }: DetailedGoalChartProps) => {
  // Custom X axis tick with SDG icon
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    // Extract goal number from string (e.g., "Goal 1" -> 1)
    const goalNum = parseInt(payload.value.replace(/\D/g, ""));

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-20} y={5} width={50} height={50}>
          <SDGIcon goalNumber={goalNum} size={50} />
        </foreignObject>
      </g>
    );
  };

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={detailedGoalData}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis dataKey="goal" tick={<CustomXAxisTick />} height={60} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => [`${value} articles`, "Count"]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ paddingTop: "10px" }}
          />
          <Bar
            dataKey="top1"
            name="Primary Goal"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
          >
            {detailedGoalData.map((entry, index) => (
              <Cell
                key={`cell-top1-${index}`}
                fill={GOAL_COLORS[entry.goalNumber - 1] || "#3B82F6"}
                fillOpacity={0.9}
              />
            ))}
          </Bar>
          <Bar
            dataKey="top2"
            name="Secondary Goal"
            fill="#10B981"
            radius={[4, 4, 0, 0]}
          >
            {detailedGoalData.map((entry, index) => (
              <Cell
                key={`cell-top2-${index}`}
                fill={GOAL_COLORS[entry.goalNumber - 1] || "#10B981"}
                fillOpacity={0.6}
              />
            ))}
          </Bar>
          <Bar
            dataKey="top3"
            name="Tertiary Goal"
            fill="#F59E0B"
            radius={[4, 4, 0, 0]}
          >
            {detailedGoalData.map((entry, index) => (
              <Cell
                key={`cell-top3-${index}`}
                fill={GOAL_COLORS[entry.goalNumber - 1] || "#F59E0B"}
                fillOpacity={0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DetailedGoalChart;
