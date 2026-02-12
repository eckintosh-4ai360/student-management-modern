"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface EnrollmentChartProps {
  classes: Array<{
    id: number;
    name: string;
    students: Array<{ id: string }>;
  }>;
}

const lightColors = [
  '#BFDBFE', // blue-200
  '#CFFAFE', // cyan-200
  '#CCFBF1', // teal-200
  '#DCFCE7', // green-200
  '#CDFE8D', // lime-200
  '#FEF08A', // yellow-200
  '#FFEAA7', // amber-200
  '#FFD6A5', // orange-200
  '#FCBAD3', // rose-200
  '#F8BBD0', // pink-200
  '#E9D5FF', // purple-200
  '#EDE9FE', // violet-200
  '#C7D2FE', // indigo-200
  '#BAE6FD', // sky-200
];

export default function EnrollmentChart({ classes }: EnrollmentChartProps) {
  const chartData = classes.map((cls, index) => ({
    name: cls.name,
    value: cls.students.length,
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis 
            type="number"
            hide
          />
          <YAxis 
            dataKey="name" 
            type="category"
            tick={{ fontSize: 12, fontWeight: 500 }}
            width={80}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#f3f4f6', 
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '8px 12px'
            }}
            formatter={(value) => [`${value} students`, 'Enrollment']}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={lightColors[index % lightColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
