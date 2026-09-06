"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const tooltipStyle = {
  background: "#0f140f",
  border: "1px solid #1a3a1a",
  color: "#c8f5d4",
  fontFamily: "JetBrains Mono, monospace",
  fontSize: 12,
};

export default function MonitorCharts({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card-grid" style={{ marginBottom: 28 }}>
      <div className="panel" style={{ gridColumn: "span 1" }}>
        <h3 style={{ marginTop: 0 }}>UPTIME % BY MONITOR</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3a1a" />
            <XAxis dataKey="name" tick={{ fill: "#557a5f", fontSize: 10 }} />
            <YAxis tick={{ fill: "#557a5f", fontSize: 10 }} domain={[0, 100]} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(0,255,102,0.05)" }} />
            <Bar dataKey="uptimePercent" radius={[2, 2, 0, 0]}>
              {data.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={
                    entry.uptimePercent >= 90
                      ? "#00ff66"
                      : entry.uptimePercent >= 50
                      ? "#ffb000"
                      : "#ff3b3b"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="panel" style={{ gridColumn: "span 1" }}>
        <h3 style={{ marginTop: 0 }}>P95 RESPONSE TIME (ms)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3a1a" />
            <XAxis dataKey="name" tick={{ fill: "#557a5f", fontSize: 10 }} />
            <YAxis tick={{ fill: "#557a5f", fontSize: 10 }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(0,255,102,0.05)" }} />
            <Bar dataKey="p95ResponseTimeMs" fill="#00d9ff" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}