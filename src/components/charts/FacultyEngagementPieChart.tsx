import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface FacultyEngagementPieChartProps {
  totalFaculty: number;
  engagingFaculty: number;
}

const FacultyEngagementPieChart = ({
  totalFaculty,
  engagingFaculty,
}: FacultyEngagementPieChartProps) => {
  const nonEngagingFaculty = totalFaculty - engagingFaculty;

  const data = [
    { name: "Engaging Faculty", value: engagingFaculty },
    { name: "Non-Engaging Faculty", value: nonEngagingFaculty },
  ];

  const COLORS = ["#818CF8", "#E4E4E7"];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name) => [
              `${value} faculty (${((value / totalFaculty) * 100).toFixed(
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

export default FacultyEngagementPieChart;
