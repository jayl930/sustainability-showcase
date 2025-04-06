
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  index?: number;
  color?: string;
}

const StatCard = ({ title, value, description, icon, className, index = 0, color }: StatCardProps) => {
  return (
    <Card 
      className={cn(
        "animate-fade-in opacity-0 overflow-hidden group card-hover",
        className
      )}
      style={{ 
        '--index': index,
        borderLeftColor: color,
        borderLeftWidth: color ? '4px' : undefined
      } as React.CSSProperties}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold transition-all duration-500 group-hover:scale-105 group-hover:pl-1">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
