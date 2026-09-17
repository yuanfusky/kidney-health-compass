import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, FileCheck2, LineChart, Lock, Stethoscope } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KidneyTrack 肾脏健康记录 — 属于患者自己的慢性肾病档案" },
      {
        name: "description",
        content:
          "KidneyTrack 帮助 CKD 与 IgA 肾病患者把多家医院的化验单、血压、用药和饮食记录整理成一条完整的健康时间线，并在复诊前生成清晰的就诊摘要。",
      },
      { property: "og:title", content: "KidneyTrack 肾脏健康记录" },
      {
        property: "og:description",
        content: "把分散在各家医院的肾脏检查资料整理成一条属于你自己的健康时间线。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { Icon: FileCheck2, title: "报告集中管理", desc: "拍照或上传 PDF，自动识别化验数值，由你本人确认后入档。" },
  { Icon: LineChart, title: "长期趋势可视化", desc: "肌酐、eGFR、尿蛋白、血压随时间变化，用药事件同图标注。" },
  { Icon: Stethoscope, title: "复诊摘要", desc: "一键生成近 3/6/12 个月的关键变化，以及想向医生确认的问题。" },
];

function Landing() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/home", replace: true });
      else setChecking(false);
    });
  }, [navigate]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-foreground">
          <Activity className="size-4" />
          KidneyTrack · 慢性肾病健康记录
        </div>
        <h1 className="mt-6 text-[34px] font-semibold leading-tight md:text-5xl">
          属于你自己的
          <br />
          肾脏健康时间线
        </h1>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
          多家医院、多年检查、纸质报告和手机照片，都可以整理到一处。KidneyTrack
          帮助 CKD 与 IgA 肾病患者和家属看清长期变化，并为每一次复诊做好准备。
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-13 px-7 text-base">
            <Link to="/auth">{checking ? "进入 KidneyTrack" : "登录 / 注册"}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-13 px-7 text-base">
            <Link to="/auth" search={{ demo: true }}>
              查看演示档案
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="kt-card p-5">
              <Icon className="size-6 text-primary" strokeWidth={1.8} />
              <h2 className="mt-3 text-[17px] font-semibold">{title}</h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-surface p-5">
          <p className="flex items-start gap-2.5 text-[15px] text-surface-foreground">
            <Lock className="mt-0.5 size-5 shrink-0 text-primary" />
            您的健康数据属于您本人，未经授权不会与第三方共享。
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            KidneyTrack 不是医生，不做诊断，也不会调整用药或替您决定营养目标。所有医疗决定请与您的医生确认。
            本原型中的患者信息均为演示数据。
          </p>
        </div>
      </div>
    </main>
  );
}
