"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useState } from "react";

const data = [
  { name: "Jan", revenue: 40000, bookings: 120 },
  { name: "Feb", revenue: 55000, bookings: 150 },
  { name: "Mar", revenue: 45000, bookings: 130 },
  { name: "Apr", revenue: 65000, bookings: 180 },
  { name: "May", revenue: 50000, bookings: 140 },
  { name: "Jun", revenue: 85000, bookings: 250 },
  { name: "Jul", revenue: 75000, bookings: 210 },
];

export default function DashboardChart() {
  const [metric, setMetric] = useState<"revenue" | "bookings">("revenue");

  return (
    <div style={{ width: "100%" }}>
      {/* Toggle */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <div style={{
          display: "flex",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-light)",
          borderRadius: 10, padding: 3, gap: 2
        }}>
          {(["revenue", "bookings"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              style={{
                padding: "5px 14px",
                borderRadius: 7,
                border: "none",
                cursor: "pointer",
                fontSize: "0.72rem",
                fontWeight: 600,
                textTransform: "capitalize",
                letterSpacing: "0.03em",
                transition: "all 0.2s",
                background: metric === m ? "var(--grad-gold-btn)" : "transparent",
                color: metric === m ? "#0d0c0a" : "var(--text-muted)",
                boxShadow: metric === m ? "0 2px 8px rgba(201,151,59,0.3)" : "none",
              }}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          {metric === "revenue" ? (
            <AreaChart data={data} margin={{ top: 10, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#c9973b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#c9973b" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(201,151,59,0.08)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                tickFormatter={(v) => `Rs ${v / 1000}k`}
                width={54}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-card2)",
                  border: "1px solid rgba(201,151,59,0.2)",
                  borderRadius: 12,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  padding: "10px 14px",
                }}
                labelStyle={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 4 }}
                itemStyle={{ color: "var(--gold-light)", fontWeight: 700, fontSize: 13 }}
                formatter={(value: unknown) => [`Rs ${Number(value).toLocaleString()}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#c9973b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                activeDot={{ r: 5, fill: "#e0b96a", stroke: "var(--bg-card)", strokeWidth: 3 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#c9973b" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#c9973b" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(201,151,59,0.08)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-card2)",
                  border: "1px solid rgba(201,151,59,0.2)",
                  borderRadius: 12,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  padding: "10px 14px",
                }}
                labelStyle={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 4 }}
                itemStyle={{ color: "var(--gold-light)", fontWeight: 700, fontSize: 13 }}
                cursor={{ fill: "rgba(201,151,59,0.06)" }}
                formatter={(value: unknown) => [Number(value), "Bookings"]}
              />
              <Bar
                dataKey="bookings"
                fill="url(#colorBookings)"
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
