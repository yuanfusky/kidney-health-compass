import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Minus, Activity, Pill, Utensils, Stethoscope, FlaskConical } from "lucide-react";
import { PageHeader } from "@/components/kt/PageHeader";
import { MetricChart, type ChartSeries } from "@/components/kt/MetricChart";
import {
  buildSeries,
  filterByRange,
  latestAndPrevious,
  useEvents,
  useLabs,
  useMeasurements,
  usePatient,
  requireMetric,
} from "@/lib/kt/data";
import { Button } from "@/components/ui/button";
import { t, useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: t("肾脏健康概览 — KidneyTrack") },
      { name: "description", content: t("查看 eGFR、肌酐、尿蛋白、血压与体重的最新数值和长期趋势。") },
      { property: "og:title", content: t("肾脏健康概览 — KidneyTrack") },
      { property: "og:description", content: t("最新指标、长期趋势与最近事件，集中在一页。") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const CARD_METRICS = ["egfr", "creatinine", "up24", "sbp", "weight"] as const;
const CHART_OPTIONS = [
  { key: "creatinine", label: "肌酐" },
  { key: "egfr", label: "eGFR" },
  { key: "up24", label: "尿蛋白" },
  { key: "weight", label: "体重" },
  { key: "sbp", label: "血压" },
] as const;
const RANGES = [
  { label: "3个月", value: 3 },
  { label: "6个月", value: 6 },
  { label: "1年", value: 12 },
  { label: "全部", value: "all" },
] as const;

const EVENT_ICONS: Record<string, typeof Activity> = {
  lab: FlaskConical,
  medication: Pill,
  lifestyle: Utensils,
  visit: Stethoscope,
  diagnosis: Activity,
};

function ChangeBadge({ diff, unit, decimals }: { diff: number | null; unit: string; decimals: number }) {
  const t = useT();
  if (diff === null) {
    return <span className="text-[13px] text-muted-foreground">{t("暂无对比")}</span>;
  }
  const rounded = Number(diff.toFixed(decimals));
  if (rounded === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[13px] text-muted-foreground">
        <Minus className="size-3.5" />{t("与上次相同")}
      </span>
    );
  }
  const up = rounded > 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className="inline-flex items-center gap-1 text-[13px] text-surface-foreground">
      <Icon className="size-3.5" />
      {t("{value} {unit} 较上次", { value: `${up ? "+" : ""}${rounded}`, unit })}
    </span>
  );
}

function HomePage() {
  const t = useT();
  const navigate = useNavigate();
  const { data: patient } = usePatient();
  const { data: labs } = useLabs();
  const { data: measurements } = useMeasurements();
  const { data: events } = useEvents();
  const [metricKey, setMetricKey] = useState<string>("creatinine");
  const [range, setRange] = useState<number | "all">(12);

  const cards = useMemo(
    () =>
      CARD_METRICS.map((key) => {
        const metric = requireMetric(key);
        const points = buildSeries(metric, labs, measurements);
        const { latest, previous } = latestAndPrevious(points);
        let extra: string | null = null;
        if (key === "sbp") {
          const dbp = buildSeries(requireMetric("dbp"), labs, measurements);
          const lastD = dbp[dbp.length - 1];
          extra = lastD ? `/ ${lastD.value}` : null;
        }
        return {
          metric,
          latest,
          previous,
          extra,
          diff: latest && previous ? latest.value - previous.value : null,
        };
      }),
    [labs, measurements],
  );

  const chartSeries: ChartSeries[] = useMemo(() => {
    const metric = requireMetric(metricKey);
    const base: ChartSeries = {
      metric,
      points: filterByRange(buildSeries(metric, labs, measurements), range),
      color: "var(--color-chart-1)",
    };
    if (metricKey === "sbp") {
      const d = requireMetric("dbp");
      return [
        base,
        {
          metric: d,
          points: filterByRange(buildSeries(d, labs, measurements), range),
          color: "var(--color-chart-2)",
        },
      ];
    }
    return [base];
  }, [metricKey, labs, measurements, range]);

  return (
    <>
      <PageHeader
        title={t("肾脏健康概览")}
        subtitle={patient ? `${t(patient.name)} · ${patient.diagnosis ? t(patient.diagnosis) : ""}` : t("加载中…")}
      />

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-5 md:px-8">
        <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {cards.map(({ metric, latest, extra, diff }) => (
            <div key={metric.key} className="kt-card p-4">
              <p className="text-[14px] font-medium text-muted-foreground">
                {metric.key === "sbp" ? t("血压 Blood Pressure") : metricLabel(metric)}
              </p>
              <p className="kt-num mt-2 text-[28px] font-semibold leading-none">
                {latest ? latest.value.toFixed(metric.decimals ?? 0) : "—"}
                {extra ? <span className="text-[20px] font-medium"> {extra}</span> : null}
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {metric.unit} · {latest ? latest.date : t("暂无记录")}
              </p>
              <div className="mt-2">
                <ChangeBadge diff={diff} unit={metric.unit} decimals={metric.decimals ?? 0} />
              </div>
            </div>
          ))}
        </section>

        <section className="kt-card p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[18px] font-semibold">{t("肾功能趋势")}</h2>
            <div className="flex gap-1.5">
              {RANGES.map((r) => (
                <button
                  key={r.label}
                  onClick={() => setRange(r.value)}
                  className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    range === r.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t(r.label)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {CHART_OPTIONS.map((o) => (
              <button
                key={o.key}
                onClick={() => setMetricKey(o.key)}
                className={`rounded-lg border px-3 py-1.5 text-[14px] font-medium transition-colors ${
                  metricKey === o.key
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {t(o.label)}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <MetricChart
              series={chartSeries}
              onPointClick={(p) => {
                if (p.reportId) navigate({ to: "/reports/$reportId", params: { reportId: p.reportId } });
              }}
            />
          </div>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {t("点击化验类曲线上的数据点，可以打开对应的原始报告。")}
          </p>
        </section>

        <section className="kt-card p-4 md:p-5">
          <h2 className="text-[18px] font-semibold">{t("最近事件")}</h2>
          <ol className="mt-4 space-y-0">
            {(events ?? []).slice(0, 8).map((e, idx, arr) => {
              const Icon = EVENT_ICONS[e.event_type] ?? Activity;
              return (
                <li key={e.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                      <Icon className="size-4.5" strokeWidth={1.8} />
                    </span>
                    {idx < Math.min(arr.length, 8) - 1 ? <span className="w-px flex-1 bg-border" /> : null}
                  </div>
                  <div className="pb-5">
                    <p className="kt-num text-[13px] text-muted-foreground">{e.date}</p>
                    <p className="text-[16px] font-medium">{t(e.title)}</p>
                    {e.description ? (
                      <p className="text-[15px] text-muted-foreground">{t(e.description)}</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
          <Button variant="outline" className="h-11 w-full text-[15px]" onClick={() => navigate({ to: "/reports" })}>
            {t("查看全部报告")}
          </Button>
        </section>
      </div>
    </>
  );
}
