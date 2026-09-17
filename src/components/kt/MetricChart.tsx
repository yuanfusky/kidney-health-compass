import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MetricDef } from "@/lib/kt/metrics";
import type { SeriesPoint } from "@/lib/kt/data";

export interface ChartSeries {
  metric: MetricDef;
  points: SeriesPoint[];
  color: string;
}

export interface ChartMarker {
  date: string;
  label: string;
}

interface Row {
  date: string;
  [key: string]: string | number | null | undefined;
}

function mergeSeries(series: ChartSeries[]): Row[] {
  const byDate = new Map<string, Row>();
  series.forEach((s, idx) => {
    s.points.forEach((p) => {
      const row = byDate.get(p.date) ?? { date: p.date };
      row[`v${idx}`] = p.value;
      if (idx === 0 && p.reportId) row["reportId"] = p.reportId;
      byDate.set(p.date, row);
    });
  });
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function shortDate(d: string) {
  const parts = d.split("-");
  return `${(parts[0] ?? "").slice(2)}/${parts[1] ?? ""}/${parts[2] ?? ""}`;
}

export function MetricChart({
  series,
  markers = [],
  onPointClick,
  height = 260,
}: {
  series: ChartSeries[];
  markers?: ChartMarker[];
  onPointClick?: (point: { date: string; reportId?: string | null }) => void;
  height?: number;
}) {
  const rows = mergeSeries(series);

  if (rows.length === 0) {
    return (
      <div
        className="grid place-items-center rounded-xl bg-muted/60 text-sm text-muted-foreground"
        style={{ height }}
      >
        暂无数据，添加记录后即可查看趋势
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={rows}
          margin={{ top: 12, right: 16, bottom: 4, left: -12 }}
          onClick={(state) => {
            const payload = state?.activePayload?.[0]?.payload as Row | undefined;
            if (payload && onPointClick) {
              onPointClick({
                date: payload["date"] as string,
                reportId: (payload["reportId"] as string | null | undefined) ?? null,
              });
            }
          }}
        >
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={shortDate}
            tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
            stroke="var(--color-border)"
            minTickGap={24}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
            stroke="var(--color-border)"
            width={54}
            domain={["auto", "auto"]}
          />
          {series.length > 1 ? (
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              stroke="var(--color-border)"
              width={54}
              domain={["auto", "auto"]}
            />
          ) : null}
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid var(--color-border)",
              background: "var(--color-card)",
              fontSize: 14,
            }}
            labelFormatter={(l) => `日期 ${l}`}
            formatter={(value, name) => {
              const idx = Number(String(name).replace("v", ""));
              const s = series[idx];
              return [`${value} ${s?.metric.unit ?? ""}`, `${s?.metric.labelZh ?? ""}`];
            }}
          />
          {markers.map((m) => (
            <ReferenceLine
              key={`${m.date}-${m.label}`}
              x={m.date}
              yAxisId="left"
              stroke="var(--color-info)"
              strokeDasharray="4 4"
              label={{
                value: m.label,
                position: "insideTopLeft",
                fill: "var(--color-info)",
                fontSize: 11,
              }}
            />
          ))}
          {series.map((s, idx) => (
            <Line
              key={s.metric.key}
              yAxisId={idx === 0 ? "left" : "right"}
              type="monotone"
              dataKey={`v${idx}`}
              stroke={s.color}
              strokeWidth={2.4}
              connectNulls
              dot={{ r: 3.5, strokeWidth: 2, fill: "var(--color-card)" }}
              activeDot={{ r: 6, cursor: onPointClick ? "pointer" : "default" }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
