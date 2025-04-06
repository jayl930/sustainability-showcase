import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export interface FacultyData {
  name: string;
  total: number;
  sustainable: number;
  topJournals: number;
}

interface TopFacultyBarChartProps {
  facultyData: FacultyData[];
}

const TopFacultyBarChart = ({ facultyData }: TopFacultyBarChartProps) => {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={facultyData} layout="vertical" margin={{ left: 200 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
          />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="name"
            width={180}
            tickFormatter={(value) => {
              return value.length > 25 ? value.substring(0, 25) + "..." : value;
            }}
          />
          <Tooltip
            formatter={(value: number) => [`${value} articles`, "Count"]}
          />
          <Legend />
          <Bar
            dataKey="total"
            name="Total Articles"
            fill="#3B82F6"
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="sustainable"
            name="Sustainable Articles"
            fill="#10B981"
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="topJournals"
            name="Top Journal Articles"
            fill="#F59E0B"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopFacultyBarChart;
