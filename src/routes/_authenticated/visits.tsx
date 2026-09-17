import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Printer, Share2, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/kt/PageHeader";
import {
  buildSeries,
  filterByRange,
  requireMetric,
  useLabs,
  useMeasurements,
  useMedications,
  useNutritionTarget,
  usePatient,
} from "@/lib/kt/data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/visits")({
  head: () => ({
    meta: [
      { title: "复诊准备 — KidneyTrack" },
      { name: "description", content: "生成近 3/6/12 个月的关键指标变化、治疗变化，以及想向医生确认的问题。" },
      { property: "og:title", content: "复诊准备 — KidneyTrack" },
      { property: "og:description", content: "一页式就诊摘要，方便与医生沟通。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VisitsPage,
});

const RANGES = [
  { label: "最近3个月", value: 3 },
  { label: "最近6个月", value: 6 },
  { label: "最近12个月", value: 12 },
] as const;

const SUMMARY_METRICS = ["creatinine", "egfr", "up24", "uacr", "weight", "sbp", "hb", "alb", "k"] as const;

const QUESTIONS = [
  "当前尿蛋白控制目标是多少？",
  "目前蛋白摄入目标是否仍然合适？",
  "体重持续下降是否需要营养干预？",
  "下一次应该复查哪些指标？",
  "现在的血压目标范围是多少？",
];

function VisitsPage() {
  const { data: patient } = usePatient();
  const { data: labs } = useLabs();
  const { data: measurements } = useMeasurements();
  const { data: medications } = useMedications();
  const { data: target } = useNutritionTarget();
  const [months, setMonths] = useState<number>(6);
  const [generated, setGenerated] = useState(false);

  const rows = useMemo(() => {
    return SUMMARY_METRICS.map((key) => {
      const metric = requireMetric(key);
      const points = filterByRange(buildSeries(metric, labs, measurements), months);
      const first = points[0];
      const last = points[points.length - 1];
      const d = metric.decimals ?? 0;
      return {
        metric,
        first,
        last,
        text:
          first && last
            ? first === last
              ? `${last.value.toFixed(d)} ${metric.unit}`
              : `${first.value.toFixed(d)} → ${last.value.toFixed(d)} ${metric.unit}`
            : "该区间内没有记录",
        delta: first && last ? Number((last.value - first.value).toFixed(d)) : null,
      };
    }).filter((r) => r.last);
  }, [labs, measurements, months]);

  const treatment = useMemo(() => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);
    const iso = cutoff.toISOString().slice(0, 10);
    const list: string[] = [];
    (medications ?? []).forEach((m) => {
      if (m.start_date && m.start_date >= iso) {
        list.push(`${m.drug_name} 于 ${m.start_date} 开始（${m.dose ?? ""} ${m.frequency ?? ""}）`);
      }
      if (m.stop_date && m.stop_date >= iso) {
        list.push(`${m.drug_name} 于 ${m.stop_date} 停用`);
      }
    });
    const current = (medications ?? []).filter((m) => !m.stop_date);
    return { changes: list, current };
  }, [medications, months]);

  const nutrition = useMemo(() => {
    const w = filterByRange(buildSeries(requireMetric("weight"), labs, measurements), months);
    const first = w[0];
    const last = w[w.length - 1];
    const lines: string[] = [];
    if (first && last) {
      const diff = Number((last.value - first.value).toFixed(1));
      lines.push(
        diff === 0
          ? `体重在过去 ${months} 个月基本稳定（${last.value.toFixed(1)} kg）。`
          : `体重在过去 ${months} 个月${diff < 0 ? "下降" : "上升"} ${Math.abs(diff).toFixed(1)} kg（${first.value.toFixed(1)} → ${last.value.toFixed(1)} kg）。`,
      );
    }
    if (target) {
      lines.push(
        `每日蛋白目标 ${target.protein_target_g} g（${target.source === "doctor" ? "医生建议" : "本人设定"}，自 ${target.start_date}）。`,
      );
    }
    return lines;
  }, [labs, measurements, months, target]);

  async function share() {
    const text = [
      `KidneyTrack 就诊摘要（近 ${months} 个月）`,
      patient ? `${patient.name} · ${patient.diagnosis ?? ""}` : "",
      "",
      "关键指标变化：",
      ...rows.map((r) => `- ${r.metric.labelZh} ${r.metric.canonical}: ${r.text}`),
      "",
      "治疗变化：",
      ...(treatment.changes.length ? treatment.changes.map((t) => `- ${t}`) : ["- 无变化"]),
      "",
      "想向医生确认的问题：",
      ...QUESTIONS.map((q) => `- ${q}`),
    ].join("\n");

    if (navigator.share) {
      try {
        await navigator.share({ title: "KidneyTrack 就诊摘要", text });
        return;
      } catch {
        /* user cancelled — fall back to clipboard */
      }
    }
    await navigator.clipboard.writeText(text);
    toast.success("摘要已复制，可以粘贴发送给家属");
  }

  return (
    <>
      <PageHeader title="复诊准备" subtitle="生成一页式就诊摘要" />

      <div className="mx-auto max-w-3xl space-y-5 px-4 py-5 md:px-8">
        <section className="kt-card kt-no-print p-4 md:p-5">
          <h2 className="flex items-center gap-2 text-[18px] font-semibold">
            <Stethoscope className="size-5 text-primary" />
            准备下一次复诊
          </h2>
          <p className="mt-1.5 text-[15px] text-muted-foreground">选择摘要覆盖的时间范围。</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setMonths(r.value)}
                className={`rounded-lg border px-4 py-2.5 text-[15px] font-medium ${
                  months === r.value
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Button className="mt-4 h-14 w-full text-[17px]" onClick={() => setGenerated(true)}>
            准备下一次复诊
          </Button>
        </section>

        {generated ? (
          <article className="kt-card space-y-6 p-5 md:p-7">
            <header>
              <h2 className="text-[22px] font-semibold">就诊摘要 · 近 {months} 个月</h2>
              <p className="mt-1 text-[15px] text-muted-foreground">
                {patient ? `${patient.name} · ${patient.sex ?? ""} · ${patient.birth_year ?? ""} 年出生` : ""}
              </p>
              <p className="text-[15px] text-muted-foreground">
                {patient?.diagnosis} · 生成日期 {new Date().toISOString().slice(0, 10)}
              </p>
            </header>

            <section>
              <h3 className="text-[17px] font-semibold">关键指标变化</h3>
              <ul className="mt-2 divide-y divide-border">
                {rows.map((r) => (
                  <li key={r.metric.key} className="flex items-baseline justify-between gap-3 py-2">
                    <span className="text-[16px]">
                      {r.metric.labelZh} {r.metric.canonical}
                    </span>
                    <span className="kt-num shrink-0 text-[16px] font-medium">{r.text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[13px] text-muted-foreground">
                所有数值均来自你确认过的报告与记录，可在报告页查看来源。
              </p>
            </section>

            <section>
              <h3 className="text-[17px] font-semibold">治疗变化</h3>
              <ul className="mt-2 space-y-1.5 text-[16px]">
                {treatment.changes.length ? (
                  treatment.changes.map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="text-primary">·</span>
                      {t}
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground">该区间内没有记录到用药变化。</li>
                )}
              </ul>
              <p className="mt-3 text-[15px] font-medium">目前在服药物</p>
              <ul className="mt-1 space-y-1 text-[15px] text-muted-foreground">
                {treatment.current.map((m) => (
                  <li key={m.id}>
                    {m.drug_name} {m.dose} {m.frequency}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-[17px] font-semibold">营养和生活状态</h3>
              <ul className="mt-2 space-y-1.5 text-[16px]">
                {nutrition.map((n) => (
                  <li key={n} className="flex gap-2">
                    <span className="text-primary">·</span>
                    {n}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-[17px] font-semibold">建议向医生确认的问题</h3>
              <ol className="mt-2 space-y-1.5 text-[16px]">
                {QUESTIONS.map((q, i) => (
                  <li key={q} className="flex gap-2">
                    <span className="kt-num text-muted-foreground">{i + 1}.</span>
                    {q}
                  </li>
                ))}
              </ol>
            </section>

            <p className="rounded-lg bg-surface p-3.5 text-[14px] leading-relaxed text-surface-foreground">
              本摘要仅整理你已记录的数据，不包含诊断、预后判断或用药建议。所有治疗与营养决定，建议在下次复诊时向医生确认。
            </p>

            <div className="kt-no-print flex flex-wrap gap-2.5">
              <Button className="h-12 flex-1 gap-2 text-base" onClick={() => window.print()}>
                <Printer className="size-4.5" />
                导出医生摘要
              </Button>
              <Button variant="outline" className="h-12 flex-1 gap-2 text-base" onClick={share}>
                <Share2 className="size-4.5" />
                分享给家属
              </Button>
            </div>
          </article>
        ) : null}
      </div>
    </>
  );
}
