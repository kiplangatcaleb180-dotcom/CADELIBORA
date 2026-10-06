import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface LearningActivityPoint {
  label: string;
  activity: number;
}

interface LearningActivityChartProps {
  data: LearningActivityPoint[];
}

export const LearningActivityChart: React.FC<LearningActivityChartProps> = ({
  data,
}) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="learningActivityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.3} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148, 163, 184, 0.12)"
          />

          <XAxis
            dataKey="label"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid rgba(148, 163, 184, 0.18)',
              borderRadius: '12px',
              color: '#fff',
            }}
          />

          <Area
            type="monotone"
            dataKey="activity"
            stroke="#60a5fa"
            strokeWidth={2}
            fill="url(#learningActivityGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
