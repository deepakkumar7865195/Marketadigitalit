"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AttendanceChartProps {
  data: { date: string; present: number; absent: number; late: number }[];
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const xLabel = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  const parsed = data.map((r) => ({ ...r, label: xLabel(r.date) }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={parsed} barCategoryGap="24%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(100,116,139,0.08)" }}
            contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="late" name="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          <Bar dataKey="absent" name="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}