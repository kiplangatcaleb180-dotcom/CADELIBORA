import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface CourseProgressPoint {
  name: string;
  progress: number;
}

interface CourseProgressChartProps {
  data: CourseProgressPoint[];
}

export const CourseProgressChart: React.FC<CourseProgressChartProps> = ({
  data,
}) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148, 163, 184, 0.12)"
          />

          <XAxis
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(value) => [`${value}%`, 'Progress']}
            contentStyle={{
              background: '#0f172a',
              border: '1px solid rgba(148, 163, 184, 0.18)',
              borderRadius: '12px',
              color: '#fff',
            }}
          />

          <Bar
            dataKey="progress"
            fill="#60a5fa"
            radius={[6, 6, 0, 0]}
            maxBarSize={42}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
