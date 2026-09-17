import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronRight, Download, Lock, LogOut, Microscope, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/kt/PageHeader";
import {
  useBiopsies,
  useEvents,
  useLabs,
  useMeasurements,
  useMedications,
  usePatient,
  useReports,
} from "@/lib/kt/data";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "个人中心 — KidneyTrack" },
      { name: "description", content: "患者档案、家属共享、隐私设置、数据导出与账号删除。" },
      { property: "og:title", content: "个人中心 — KidneyTrack" },
      { property: "og:description", content: "您的健康数据属于您本人，未经授权不会与第三方共享。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: patient } = usePatient();
  const { data: reports } = useReports();
  const { data: labs } = useLabs();
  const { data: measurements } = useMeasurements();
  const { data: medications } = useMedications();
  const { data: events } = useEvents();
  const { data: biopsies } = useBiopsies();
  const [shareTrends, setShareTrends] = useState(true);
  const [shareReports, setShareReports] = useState(true);

  function exportData() {
    const payload = { patient, reports, labs, measurements, medications, events, biopsies, exported_at: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kidneytrack-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("数据已导出");
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <>
      <PageHeader title="个人中心" showProfile={false} />

      <div className="mx-auto max-w-3xl space-y-5 px-4 py-5 md:px-8">
        <section className="kt-card p-5">
          <p className="text-[22px] font-semibold">{patient?.name ?? "—"}</p>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {patient?.sex} · {patient?.birth_year} 年出生
          </p>
          <p className="mt-2 text-[16px]">{patient?.diagnosis}</p>
          <p className="text-[14px] text-muted-foreground">确诊日期 {patient?.diagnosis_date}</p>
          <p className="mt-3 rounded-lg bg-surface p-3 text-[13px] text-surface-foreground">
            本原型使用虚构演示患者数据。
          </p>
        </section>

        <nav className="kt-card divide-y divide-border">
          <Link to="/biopsy" className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/40">
            <Microscope className="size-5 text-primary" />
            <span className="flex-1 text-[17px] font-medium">IgA肾病病理</span>
            <ChevronRight className="size-5 text-muted-foreground" />
          </Link>
          <Link to="/family" className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/40">
            <Users className="size-5 text-primary" />
            <span className="flex-1 text-[17px] font-medium">家属管理</span>
            <ChevronRight className="size-5 text-muted-foreground" />
          </Link>
        </nav>

        <section className="kt-card p-5">
          <h2 className="flex items-center gap-2 text-[18px] font-semibold">
            <Lock className="size-5 text-primary" />
            隐私设置
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed">
            您的健康数据属于您本人，未经授权不会与第三方共享。
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            报告文件保存在私有存储空间，只有你和你授权的家属可以访问；访问链接为临时有效链接。
          </p>

          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between gap-3">
              <span className="text-[16px]">允许家属查看趋势图</span>
              <Switch checked={shareTrends} onCheckedChange={setShareTrends} />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="text-[16px]">允许家属查看原始报告</span>
              <Switch checked={shareReports} onCheckedChange={setShareReports} />
            </label>
          </div>
        </section>

        <section className="kt-card p-5">
          <h2 className="text-[18px] font-semibold">数据与账号</h2>
          <div className="mt-3 space-y-2.5">
            <Button variant="outline" className="h-12 w-full justify-start gap-2.5 text-[16px]" onClick={exportData}>
              <Download className="size-4.5 text-primary" />
              导出我的全部数据
            </Button>
            <Button variant="outline" className="h-12 w-full justify-start gap-2.5 text-[16px]" onClick={signOut}>
              <LogOut className="size-4.5 text-primary" />
              退出登录
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="h-12 w-full justify-start gap-2.5 text-[16px] text-destructive">
                  <Trash2 className="size-4.5" />
                  删除账号与数据
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl">删除账号与数据？</AlertDialogTitle>
                  <AlertDialogDescription className="text-[15px]">
                    删除后你的健康档案、报告文件与家属共享权限都会被永久移除，且无法恢复。建议先导出数据备份。
                    演示档案中的数据不会被删除。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="h-12 text-base">取消</AlertDialogCancel>
                  <AlertDialogAction
                    className="h-12 text-base"
                    onClick={async () => {
                      toast.success("删除请求已提交，账号将在退出后处理");
                      await signOut();
                    }}
                  >
                    确认删除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>

        <p className="rounded-xl bg-surface p-4 text-[14px] leading-relaxed text-surface-foreground">
          KidneyTrack 是数据助手，不是医生。它可以整理记录、说明医学名词、找出缺失的检查并帮你准备复诊问题，但不会诊断疾病、
          调整用药、决定营养目标或预测预后。有疑问时，建议在下次复诊时向医生确认。
        </p>
      </div>
    </>
  );
}
