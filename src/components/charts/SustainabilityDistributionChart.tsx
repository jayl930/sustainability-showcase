
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface SustainabilityDistributionChartProps {
  sustainableArticles: number;
  totalArticles: number;
}

const SustainabilityDistributionChart = ({
  sustainableArticles,
  totalArticles,
}: SustainabilityDistributionChartProps) => {
  const data = [
    { name: "Sustainable", value: sustainableArticles },
    { name: "Non-Sustainable", value: totalArticles - sustainableArticles },
  ];

  // Custom label showing only percentage
  const renderCustomizedLabel = ({ percent }: { percent: number }) => {
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            <Cell fill="#3B82F6" />
            <Cell fill="#E5E7EB" />
          </Pie>
          <Tooltip
            formatter={(value: number, name) => [
              `${value} articles (${((value / totalArticles) * 100).toFixed(
                1
              )}%)`,
              name,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SustainabilityDistributionChart;
