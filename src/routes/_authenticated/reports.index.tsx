import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BadgeCheck, ChevronRight, Clock, Upload } from "lucide-react";
import { PageHeader } from "@/components/kt/PageHeader";
import { UploadFlow } from "@/components/kt/UploadFlow";
import { useLabs, useReports } from "@/lib/kt/data";
import { Button } from "@/components/ui/button";
import { t, useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/reports/")({
  head: () => ({
    meta: [
      { title: t("检查报告 — KidneyTrack") },
      { name: "description", content: t("按时间排列的化验单与病理报告，上传后识别结果由本人确认再入档。") },
      { property: "og:title", content: t("检查报告 — KidneyTrack") },
      { property: "og:description", content: t("集中管理来自不同医院的肾脏检查报告。") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const t = useT();
  const { data: reports, isLoading } = useReports();
  const { data: labs } = useLabs();
  const [open, setOpen] = useState(false);

  const countByReport = useMemo(() => {
    const map = new Map<string, number>();
    (labs ?? []).forEach((l) => {
      if (l.report_id) map.set(l.report_id, (map.get(l.report_id) ?? 0) + 1);
    });
    return map;
  }, [labs]);

  return (
    <>
      <PageHeader title={t("检查报告")} subtitle={t("共 {n} 份报告", { n: reports?.length ?? 0 })} />

      <div className="mx-auto max-w-4xl space-y-4 px-4 py-5 md:px-8">
        <Button className="h-14 w-full gap-2 text-[17px]" onClick={() => setOpen(true)}>
          <Upload className="size-5" />
          {t("上传检查报告")}
        </Button>

        {isLoading ? <p className="text-muted-foreground">{t("加载中…")}</p> : null}

        <ul className="space-y-3">
          {(reports ?? []).map((r) => (
            <li key={r.id}>
              <Link
                to="/reports/$reportId"
                params={{ reportId: r.id }}
                className="kt-card flex items-center gap-3 p-4 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="kt-num text-[15px] font-medium text-muted-foreground">{r.report_date}</span>
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-[13px] font-medium text-accent-foreground">
                      {t(r.report_type)}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[17px] font-medium">{r.hospital ? t(r.hospital) : t("未填写医院")}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-muted-foreground">
                    <span>{t("已提取 {n} 项指标", { n: countByReport.get(r.id) ?? 0 })}</span>
                    {r.verified ? (
                      <span className="inline-flex items-center gap-1 text-positive">
                        <BadgeCheck className="size-4" />
                        {t("已确认")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-caution">
                        <Clock className="size-4" />
                        {t("待确认")}
                      </span>
                    )}
                  </p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>

        {!isLoading && (reports ?? []).length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">{t("还没有报告，点击上方按钮上传第一份检查报告。")}</p>
        ) : null}
      </div>

      <UploadFlow open={open} onOpenChange={setOpen} />
    </>
  );
}
