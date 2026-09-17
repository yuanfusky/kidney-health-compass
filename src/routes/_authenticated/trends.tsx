import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pill } from "lucide-react";
import { PageHeader } from "@/components/kt/PageHeader";
import { t, useT } from "@/lib/i18n";
import { MetricChart, type ChartSeries, type ChartMarker } from "@/components/kt/MetricChart";
import { METRICS, METRIC_CATEGORIES, metricLabel } from "@/lib/kt/metrics";
import {
  buildSeries,
  filterByRange,
  latestAndPrevious,
  requireMetric,
  useLabs,
  useMeasurements,
  useMedications,
} from "@/lib/kt/data";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/trends")({
  head: () => ({
    meta: [
      { title: `${t("指标趋势")} — KidneyTrack` },
      { name: "description", content: t("肾功能、尿蛋白、电解质、营养与心血管指标的长期趋势，可叠加用药事件。") },
      { property: "og:title", content: `${t("指标趋势")} — KidneyTrack` },
      { property: "og:description", content: t("选择一到两项指标叠加对比，看清数月至数年的变化。") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrendsPage,
});

const RANGES = [
  { label: "3个月", value: 3 },
  { label: "6个月", value: 6 },
  { label: "1年", value: 12 },
  { label: "全部", value: "all" },
] as const;

function TrendsPage() {
  const t = useT();
  const navigate = useNavigate();
  const { data: labs } = useLabs();
  const { data: measurements } = useMeasurements();
  const { data: medications } = useMedications();
  const [category, setCategory] = useState<string>("肾功能");
  const [primary, setPrimary] = useState("creatinine");
  const [secondary, setSecondary] = useState<string | null>("up24");
  const [showMeds, setShowMeds] = useState(true);
  const [range, setRange] = useState<number | "all">("all");

  const categoryMetrics = METRICS.filter((m) => m.category === category);

  const series: ChartSeries[] = useMemo(() => {
    const list: ChartSeries[] = [
      {
        metric: requireMetric(primary),
        points: filterByRange(buildSeries(requireMetric(primary), labs, measurements), range),
        color: "var(--color-chart-1)",
      },
    ];
    if (secondary && secondary !== primary) {
      list.push({
        metric: requireMetric(secondary),
        points: filterByRange(buildSeries(requireMetric(secondary), labs, measurements), range),
        color: "var(--color-chart-2)",
      });
    }
    return list;
  }, [primary, secondary, labs, measurements, range]);

  const markers: ChartMarker[] = useMemo(() => {
    if (!showMeds) return [];
    return (medications ?? [])
      .filter((m) => m.start_date)
      .map((m) => ({
        date: m.start_date!,
        label: t("{name} 开始", { name: t(m.drug_name) }),
      }));
  }, [medications, showMeds]);

  return (
    <>
      <PageHeader title={t("指标趋势")} subtitle={t("选择一到两项指标叠加对比")} />

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-5 md:px-8">
        <div className="kt-segment max-w-full flex-wrap">
          {METRIC_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                const first = METRICS.find((m) => m.category === c)!;
                setPrimary(first.key);
              }}
              className={`rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${
                category === c ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t(c)}
            </button>
          ))}
        </div>

        <section className="kt-card p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[18px] font-semibold">{t(category)}</h2>
            <div className="kt-segment">
              {RANGES.map((r) => (
                <button
                  key={r.label}
                  onClick={() => setRange(r.value)}
                  className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    range === r.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {t(r.label)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <p className="kt-eyebrow mb-2">{t("主指标")}</p>
              <div className="flex flex-wrap gap-1.5">
                {categoryMetrics.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setPrimary(m.key)}
                    className={`rounded-full border px-3.5 py-1.5 text-[14px] font-medium transition-colors ${
                      primary === m.key
                        ? "border-primary/40 bg-accent text-accent-foreground"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {t(m.labelZh)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="kt-eyebrow mb-2">{t("叠加第二项（可选）")}</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSecondary(null)}
                  className={`rounded-full border px-3.5 py-1.5 text-[14px] font-medium transition-colors ${
                    secondary === null
                      ? "border-primary/40 bg-accent text-accent-foreground"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {t("不叠加")}
                </button>
                {METRICS.filter((m) => m.key !== primary).map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setSecondary(m.key)}
                    className={`rounded-full border px-3.5 py-1.5 text-[14px] font-medium transition-colors ${
                      secondary === m.key
                        ? "border-primary/40 bg-accent text-accent-foreground"
                        : "border-border text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {t(m.labelZh)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2.5">
            <Switch id="meds" checked={showMeds} onCheckedChange={setShowMeds} />
            <Label htmlFor="meds" className="flex items-center gap-1.5 text-[15px]">
              <Pill className="size-4 text-info" />
              {t("在图上标注用药事件")}
            </Label>
          </div>

          <div className="mt-3">
            <MetricChart
              series={series}
              markers={markers}
              height={300}
              onPointClick={(p) => {
                if (p.reportId) navigate({ to: "/reports/$reportId", params: { reportId: p.reportId } });
              }}
            />
          </div>

          <ul className="mt-3 space-y-1.5">
            {series.map((s) => {
              const { latest, previous } = latestAndPrevious(s.points);
              const d = s.metric.decimals ?? 0;
              return (
                <li key={s.metric.key} className="flex items-center gap-2 text-[15px]">
                  <span className="size-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="font-medium">
                    {metricLabel(s.metric)}
                  </span>
                  <span className="kt-num ml-auto text-muted-foreground">
                    {previous ? `${previous.value.toFixed(d)} → ` : ""}
                    {latest ? `${latest.value.toFixed(d)} ${s.metric.unit}` : t("暂无数据")}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <p className="rounded-xl bg-surface p-4 text-[14px] leading-relaxed text-surface-foreground">
          {t("趋势图用于帮助你理解数月到数年间的变化，单次数值的小幅波动通常不代表病情变化。具体解读建议在下次复诊时向医生确认。")}
        </p>
      </div>
    </>
  );
}
