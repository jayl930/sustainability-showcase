
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";

interface GrowthData {
  year: string;
  growthRate?: number;
  rollingGrowthRate?: number;
}

interface GrowthRateChartProps {
  data: GrowthData[];
  title: string;
  description: string;
  lineColor: string;
  rollingLineColor: string;
  dataKey: string;
  rollingDataKey: string;
}

const GrowthRateChart = ({ 
  data, 
  title, 
  description,
  lineColor,
  rollingLineColor,
  dataKey,
  rollingDataKey
}: GrowthRateChartProps) => {
  // Filter out 1971 and ensure data is sorted by year
  const filteredData = data
    .filter(item => item.year !== "1971")
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" />
              <YAxis 
                domain={[-50, 50]} 
                label={{ 
                  value: 'Growth Rate (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }} 
              />
              <Tooltip 
                formatter={(value: any) => [`${value ? value.toFixed(1) : 'N/A'}%`, 'Growth Rate']}
              />
              <Legend />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                name="Annual Growth" 
                stroke={lineColor} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }}
                strokeWidth={1.5}
              />
              <Line 
                type="monotone" 
                dataKey={rollingDataKey} 
                name="5-Year Rolling Average" 
                stroke={rollingLineColor} 
                dot={false}
                activeDot={{ r: 6 }}
                strokeWidth={2.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthRateChart;
