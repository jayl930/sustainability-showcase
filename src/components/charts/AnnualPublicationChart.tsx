
import { LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface AnnualTrend {
  year: string;
  totalArticles: number;
  sustainableArticles: number;
  topJournalArticles: number;
  growthRate?: number;
  sustainableGrowthRate?: number;
  generalBusiness: number;
  utDallas: number;
  financialTimes: number;
  other: number;
}

interface AnnualPublicationChartProps {
  annualData: AnnualTrend[];
  showTopJournals?: boolean;
}

const AnnualPublicationChart = ({ annualData, showTopJournals = false }: AnnualPublicationChartProps) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={annualData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number) => [`${value} articles`, 'Count']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="totalArticles" 
            name="Total Articles"
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          {showTopJournals && (
            <Line 
              type="monotone" 
              dataKey="topJournalArticles" 
              name="Top Journal Articles"
              stroke="#F59E0B" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          )}
          <Line 
            type="monotone" 
            dataKey="sustainableArticles" 
            name="SDG Relevant Articles"
            stroke="#10B981" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnnualPublicationChart;
