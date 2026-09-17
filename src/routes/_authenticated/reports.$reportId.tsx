import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/kt/PageHeader";
import { labelFor, metricByCanonical } from "@/lib/kt/metrics";
import type { LabRow, ReportRow } from "@/lib/kt/data";
import { Button } from "@/components/ui/button";
import { t, useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/reports/$reportId")({
  head: () => ({
    meta: [
      { title: t("报告详情 — KidneyTrack") },
      { name: "description", content: t("查看原始报告、AI 识别值与你确认后的数值。") },
      { property: "og:title", content: t("报告详情 — KidneyTrack") },
      { property: "og:description", content: t("每一项数值都保留来源报告与确认记录。") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportDetail,
});

function ReportDetail() {
  const t = useT();
  const { reportId } = useParams({ from: "/_authenticated/reports/$reportId" });

  const { data, isLoading } = useQuery({
    queryKey: ["report", reportId],
    queryFn: async () => {
      const [{ data: report, error: e1 }, { data: labs, error: e2 }] = await Promise.all([
        supabase.from("reports").select("*").eq("id", reportId).single(),
        supabase.from("lab_results").select("*").eq("report_id", reportId).order("canonical_name"),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
      let signedUrl: string | null = null;
      const path = (report as ReportRow).file_url;
      if (path) {
        const { data: signed } = await supabase.storage.from("reports").createSignedUrl(path, 3600);
        signedUrl = signed?.signedUrl ?? null;
      }
      return { report: report as ReportRow, labs: (labs ?? []) as LabRow[], signedUrl };
    },
  });

  return (
    <>
      <PageHeader
        title={t("报告详情")}
        subtitle={data ? `${data.report.report_date} · ${data.report.hospital ? t(data.report.hospital) : ""}` : t("加载中…")}
        showProfile={false}
        action={
          <Button asChild variant="ghost" size="icon" className="size-11">
            <Link to="/reports" aria-label={t("返回报告列表")}>
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
        }
      />

      <div className="mx-auto max-w-3xl space-y-4 px-4 py-5 md:px-8">
        {isLoading ? <p className="text-muted-foreground">{t("加载中…")}</p> : null}

        {data ? (
          <>
            <section className="kt-card p-4">
              <p className="text-[15px] text-muted-foreground">{t("报告类型")}</p>
              <p className="text-[19px] font-semibold">{t(data.report.report_type)}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-[15px]">
                <div>
                  <p className="text-muted-foreground">{t("检查日期")}</p>
                  <p className="kt-num font-medium">{data.report.report_date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t("来源")}</p>
                  <p className="font-medium">
                    {data.report.source_kind === "manual"
                      ? t("手动录入")
                      : data.report.source_kind === "pdf"
                        ? t("PDF 报告")
                        : t("报告照片")}
                  </p>
                </div>
              </div>
              {data.signedUrl ? (
                <Button asChild variant="outline" className="mt-4 h-12 w-full gap-2 text-[15px]">
                  <a href={data.signedUrl} target="_blank" rel="noreferrer">
                    <FileText className="size-4.5" />
                    {t("查看原始报告文件")}
                  </a>
                </Button>
              ) : (
                <p className="mt-4 rounded-lg bg-surface p-3 text-[14px] text-surface-foreground">
                  {t("这份报告没有附带原始文件（演示数据或手动录入）。")}
                </p>
              )}
            </section>

            <section className="kt-card p-4">
              <h2 className="text-[18px] font-semibold">{t("检查数值")}</h2>
              <ul className="mt-3 divide-y divide-border">
                {data.labs.map((l) => {
                  const metric = metricByCanonical(l.canonical_name);
                  const decimals = metric?.decimals ?? 0;
                  const confirmed = l.confirmed_value ?? l.extracted_value;
                  return (
                    <li key={l.id} className="py-3">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-[16px] font-medium">{labelFor(l.canonical_name)}</p>
                        <p className="kt-num shrink-0 text-[19px] font-semibold">
                          {confirmed !== null ? Number(confirmed).toFixed(decimals) : "—"}
                          <span className="ml-1 text-[14px] font-normal text-muted-foreground">
                            {l.original_unit}
                          </span>
                        </p>
                      </div>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {t("测量日期 {date}", { date: l.measured_at })}
                        {l.reference_min !== null || l.reference_max !== null
                          ? t(" · 参考范围 {min} – {max} {unit}", {
                              min: l.reference_min ?? "—",
                              max: l.reference_max ?? "—",
                              unit: l.original_unit ?? "",
                            })
                          : ""}
                      </p>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {l.extracted_value !== null
                          ? `${t("AI 识别值 {value}", { value: l.extracted_value })}${
                              l.confidence
                                ? t(" · 可信度 {pct}%", { pct: Math.round(Number(l.confidence) * 100) })
                                : ""
                            }${t(" · 已由本人确认")}`
                          : t("由本人手动录入")}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>

            <p className="flex items-start gap-2 rounded-xl bg-surface p-4 text-[14px] text-surface-foreground">
              <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-primary" />
              {t("数据来源完整保留：原始报告、AI 识别值与你确认的数值分别留档。指标含义与处理方式，建议在下次复诊时向医生确认。")}
            </p>
          </>
        ) : null}
      </div>
    </>
  );
}
