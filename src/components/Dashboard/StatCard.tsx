
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  className?: string;
}

const StatCard = ({ title, value, icon, trend, className = "" }: StatCardProps) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {trend !== undefined && (
            <p
              className={`text-xs mt-1 flex items-center ${
                trend > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% منذ آخر امتحان
            </p>
          )}
        </div>
        <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
