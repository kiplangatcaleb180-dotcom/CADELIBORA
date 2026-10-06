import React from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export interface LearningStatusPoint {
  name: string;
  value: number;
}

interface LearningStatusChartProps {
  data: LearningStatusPoint[];
}

const STATUS_COLORS = ['#60a5fa', '#34d399', '#a78bfa'];

export const LearningStatusChart: React.FC<LearningStatusChartProps> = ({
  data,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={105}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={STATUS_COLORS[index % STATUS_COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid rgba(148, 163, 184, 0.18)',
              borderRadius: '12px',
              color: '#fff',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{total}</span>
        <span className="text-xs text-slate-400">Courses</span>
      </div>

      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-xs text-slate-400">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  STATUS_COLORS[index % STATUS_COLORS.length],
              }}
            />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};
