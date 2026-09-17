import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Info, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/kt/PageHeader";
import { DEMO_PATIENT_ID, useBiopsies } from "@/lib/kt/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { t, useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/biopsy")({
  head: () => ({
    meta: [
      { title: t("IgA肾病病理 — KidneyTrack") },
      { name: "description", content: t("记录肾穿刺活检报告与牛津 MEST-C 分型，每个字段都有名词解释。") },
      { property: "og:title", content: t("IgA肾病病理 — KidneyTrack") },
      { property: "og:description", content: t("结构化保存活检信息，方便复诊时与医生沟通。") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BiopsyPage,
});

function getMestC(t: ReturnType<typeof useT>) {
  return [
    {
      key: "m_score",
      label: t("M"),
      title: t("M — 系膜细胞增生 (Mesangial hypercellularity)"),
      desc: t("描述肾小球系膜区细胞数量是否增多。常见记录为 M0 或 M1。"),
    },
    {
      key: "e_score",
      label: t("E"),
      title: t("E — 内皮细胞增生 (Endocapillary hypercellularity)"),
      desc: t("描述毛细血管内细胞是否增多，常见记录为 E0 或 E1。"),
    },
    {
      key: "s_score",
      label: t("S"),
      title: t("S — 节段性硬化 (Segmental glomerulosclerosis)"),
      desc: t("描述部分肾小球是否出现节段性硬化，常见记录为 S0 或 S1。"),
    },
    {
      key: "t_score",
      label: t("T"),
      title: t("T — 肾小管萎缩／间质纤维化 (Tubular atrophy / interstitial fibrosis)"),
      desc: t("描述肾间质纤维化范围，常见记录为 T0、T1 或 T2。"),
    },
    {
      key: "c_score",
      label: t("C"),
      title: t("C — 新月体 (Crescents)"),
      desc: t("描述是否存在新月体形成，常见记录为 C0、C1 或 C2。"),
    },
  ] as const;
}

function BiopsyPage() {
  const t = useT();
  const { data: biopsies } = useBiopsies();
  const MEST_C = getMestC(t);

  return (
    <>
      <PageHeader
        title={t("IgA肾病病理")}
        subtitle={t("肾穿刺活检记录")}
        showProfile={false}
        action={
          <Button asChild variant="ghost" size="icon" className="size-11">
            <Link to="/profile" aria-label={t("返回个人中心")}>
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
        }
      />

      <div className="mx-auto max-w-3xl space-y-5 px-4 py-5 md:px-8">
        <AddBiopsyDialog />

        {(biopsies ?? []).map((b) => (
          <section key={b.id} className="kt-card p-5">
            <p className="kt-num text-[15px] text-muted-foreground">{b.biopsy_date}</p>
            <p className="text-[19px] font-semibold">{b.hospital ? t(b.hospital) : t("未填写医院")}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-[15px]">
              <div className="rounded-lg bg-surface p-3">
                <p className="text-muted-foreground">{t("肾小球总数")}</p>
                <p className="kt-num text-[20px] font-semibold">{b.total_glomeruli ?? "—"}</p>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <p className="text-muted-foreground">{t("球性硬化数")}</p>
                <p className="kt-num text-[20px] font-semibold">{b.globally_sclerotic_glomeruli ?? "—"}</p>
              </div>
            </div>

            <p className="mt-5 text-[16px] font-semibold">{t("牛津分型 Oxford MEST-C")}</p>
            <ul className="mt-2 grid grid-cols-5 gap-2">
              {MEST_C.map((f) => (
                <li key={f.key} className="rounded-lg border border-border p-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-[14px] font-medium text-muted-foreground">{f.label}</span>
                    <Popover>
                      <PopoverTrigger aria-label={t("{label} 说明", { label: f.label })} className="text-muted-foreground">
                        <Info className="size-3.5" />
                      </PopoverTrigger>
                      <PopoverContent className="w-72 text-[14px] leading-relaxed">
                        <p className="font-medium">{f.title}</p>
                        <p className="mt-1.5 text-muted-foreground">{f.desc}</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <p className="kt-num text-[18px] font-semibold">
                    {(b[f.key as keyof typeof b] as string | null) ?? "—"}
                  </p>
                </li>
              ))}
            </ul>

            {b.notes ? <p className="mt-4 text-[15px] text-muted-foreground">{t("备注：{notes}", { notes: b.notes })}</p> : null}
          </section>
        ))}

        <p className="rounded-xl bg-surface p-4 text-[14px] leading-relaxed text-surface-foreground">
          {t(
            "病理分型只作为记录保存，KidneyTrack 不会据此预测病情走向或预后。分型含义与后续随访计划，建议在下次复诊时向医生确认。",
          )}
        </p>
      </div>
    </>
  );
}

function AddBiopsyDialog() {
  const t = useT();
  const MEST_C = getMestC(t);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    biopsy_date: "",
    hospital: "",
    total_glomeruli: "",
    globally_sclerotic_glomeruli: "",
    m_score: "M1",
    e_score: "E0",
    s_score: "S1",
    t_score: "T1",
    c_score: "C0",
    notes: "",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-14 w-full gap-2 text-[17px]">
          <Plus className="size-5" />
          {t("添加肾穿刺病理报告")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("肾穿刺病理报告")}</DialogTitle>
          <DialogDescription className="text-[15px]">
            {t("按报告原文填写。每个分型字段旁的信息图标可以查看名词解释。")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[15px]">{t("穿刺日期")}</Label>
              <Input
                type="date"
                value={form.biopsy_date}
                onChange={(e) => set("biopsy_date", e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[15px]">{t("医院")}</Label>
              <Input value={form.hospital} onChange={(e) => set("hospital", e.target.value)} className="h-12 text-base" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[15px]">{t("肾小球总数")}</Label>
              <Input
                inputMode="numeric"
                value={form.total_glomeruli}
                onChange={(e) => set("total_glomeruli", e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[15px]">{t("球性硬化数")}</Label>
              <Input
                inputMode="numeric"
                value={form.globally_sclerotic_glomeruli}
                onChange={(e) => set("globally_sclerotic_glomeruli", e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {MEST_C.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="flex items-center gap-1 text-[15px]">
                  {f.label}
                  <Popover>
                    <PopoverTrigger aria-label={t("{label} 说明", { label: f.label })} className="text-muted-foreground">
                      <Info className="size-3.5" />
                    </PopoverTrigger>
                    <PopoverContent className="w-72 text-[14px] leading-relaxed">
                      <p className="font-medium">{f.title}</p>
                      <p className="mt-1.5 text-muted-foreground">{f.desc}</p>
                    </PopoverContent>
                  </Popover>
                </Label>
                <Input
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="h-11 px-2 text-center text-base"
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label className="text-[15px]">{t("备注（可选）")}</Label>
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className="min-h-20 text-base" />
          </div>

          <label className="flex h-12 cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 text-[15px]">
            <Upload className="size-4.5 text-primary" />
            {file ? file.name : t("上传病理报告文件（可选）")}
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              accept="image/*,application/pdf"
            />
          </label>
        </div>

        <Button
          className="h-12 text-base"
          onClick={async () => {
            if (!form.biopsy_date) {
              toast.error(t("请填写穿刺日期"));
              return;
            }
            let path: string | null = null;
            if (file) {
              const key = `${DEMO_PATIENT_ID}/biopsy-${crypto.randomUUID()}-${file.name}`;
              const { error } = await supabase.storage.from("reports").upload(key, file);
              if (error) {
                toast.error(t("文件上传失败，请重试"));
                return;
              }
              path = key;
            }
            const { error } = await supabase.from("biopsy_records").insert({
              patient_id: DEMO_PATIENT_ID,
              biopsy_date: form.biopsy_date,
              hospital: form.hospital || null,
              total_glomeruli: form.total_glomeruli ? Number(form.total_glomeruli) : null,
              globally_sclerotic_glomeruli: form.globally_sclerotic_glomeruli
                ? Number(form.globally_sclerotic_glomeruli)
                : null,
              m_score: form.m_score,
              e_score: form.e_score,
              s_score: form.s_score,
              t_score: form.t_score,
              c_score: form.c_score,
              notes: form.notes || null,
              file_url: path,
            });
            if (error) {
              toast.error(t("保存失败，请重试"));
              return;
            }
            await queryClient.invalidateQueries();
            toast.success(t("病理报告已保存"));
            setOpen(false);
          }}
        >
          {t("保存")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
