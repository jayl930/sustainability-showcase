
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface JournalSustainabilityData {
  category: string;
  sustainable: number;
  nonSustainable: number;
}

interface JournalSustainabilityChartProps {
  journalData: JournalSustainabilityData[];
}

const JournalSustainabilityChart = ({ journalData }: JournalSustainabilityChartProps) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={journalData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number) => [`${value} articles`, 'Count']}
          />
          <Legend />
          <Bar 
            dataKey="sustainable" 
            name="Sustainable"
            stackId="a"
            fill="#10B981" 
          />
          <Bar 
            dataKey="nonSustainable" 
            name="Non-Sustainable"
            stackId="a"
            fill="#E5E7EB" 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default JournalSustainabilityChart;
