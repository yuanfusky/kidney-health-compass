import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, Dumbbell, HeartPulse, Pill, Plus, Scale, Utensils, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/kt/PageHeader";
import {
  DEMO_PATIENT_ID,
  useFoodItems,
  useFoodLogs,
  useMeasurements,
  useMedications,
  useNutritionTarget,
} from "@/lib/kt/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/daily")({
  head: () => ({
    meta: [
      { title: "日常记录 — KidneyTrack" },
      { name: "description", content: "记录血压、体重、心率、运动、药物与症状，并跟踪每日蛋白摄入。" },
      { property: "og:title", content: "日常记录 — KidneyTrack" },
      { property: "og:description", content: "每日蛋白预算由你或医生设定，KidneyTrack 只负责记录。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DailyPage,
});

const today = () => new Date().toISOString().slice(0, 10);

function DailyPage() {
  const queryClient = useQueryClient();
  const { data: measurements } = useMeasurements();
  const { data: medications } = useMedications();
  const { data: target } = useNutritionTarget();
  const { data: foodItems } = useFoodItems();
  const { data: foodLogs } = useFoodLogs(today());

  const latest = (type: string) => {
    const list = (measurements ?? []).filter((m) => m.type === type);
    return list[list.length - 1];
  };

  const proteinToday = useMemo(
    () => (foodLogs ?? []).reduce((sum, l) => sum + (l.food_items?.protein_g ?? 0) * Number(l.amount), 0),
    [foodLogs],
  );
  const proteinTarget = target?.protein_target_g ?? 0;
  const remaining = Math.max(proteinTarget - proteinToday, 0);

  async function addMeasurement(type: string, value: number, value2?: number, unit?: string, note?: string) {
    const { error } = await supabase.from("measurements").insert({
      patient_id: DEMO_PATIENT_ID,
      type,
      value,
      value2: value2 ?? null,
      unit: unit ?? null,
      note: note ?? null,
      timestamp: new Date().toISOString(),
    });
    if (error) {
      toast.error("保存失败，请重试");
      return false;
    }
    await queryClient.invalidateQueries();
    toast.success("已记录");
    return true;
  }

  return (
    <>
      <PageHeader title="日常记录" subtitle="血压 · 体重 · 心率 · 运动 · 药物 · 症状" />

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-5 md:px-8">
        {/* Quick entry */}
        <section className="grid gap-3 sm:grid-cols-2">
          <QuickCard
            icon={<HeartPulse className="size-5 text-primary" />}
            title="血压"
            latest={
              latest("blood_pressure")
                ? `${latest("blood_pressure")!.value} / ${latest("blood_pressure")!.value2} mmHg`
                : "暂无记录"
            }
            latestDate={latest("blood_pressure")?.timestamp.slice(0, 10)}
            fields={[
              { key: "sys", label: "收缩压", unit: "mmHg" },
              { key: "dia", label: "舒张压", unit: "mmHg" },
            ]}
            onSubmit={(v) => addMeasurement("blood_pressure", Number(v["sys"]), Number(v["dia"]), "mmHg")}
          />
          <QuickCard
            icon={<Scale className="size-5 text-primary" />}
            title="体重"
            latest={latest("weight") ? `${latest("weight")!.value} kg` : "暂无记录"}
            latestDate={latest("weight")?.timestamp.slice(0, 10)}
            fields={[{ key: "w", label: "体重", unit: "kg" }]}
            onSubmit={(v) => addMeasurement("weight", Number(v["w"]), undefined, "kg")}
          />
          <QuickCard
            icon={<Activity className="size-5 text-primary" />}
            title="心率"
            latest={latest("heart_rate") ? `${latest("heart_rate")!.value} bpm` : "暂无记录"}
            latestDate={latest("heart_rate")?.timestamp.slice(0, 10)}
            fields={[{ key: "hr", label: "心率", unit: "bpm" }]}
            onSubmit={(v) => addMeasurement("heart_rate", Number(v["hr"]), undefined, "bpm")}
          />
          <QuickCard
            icon={<Dumbbell className="size-5 text-primary" />}
            title="运动"
            latest={latest("exercise") ? `${latest("exercise")!.value} 分钟` : "暂无记录"}
            latestDate={latest("exercise")?.timestamp.slice(0, 10)}
            fields={[{ key: "min", label: "时长", unit: "分钟" }]}
            noteLabel="运动方式"
            onSubmit={(v) => addMeasurement("exercise", Number(v["min"]), undefined, "min", v["note"])}
          />
        </section>

        <SymptomCard onSubmit={addMeasurement} latest={latest("symptom")} />

        {/* Protein budget */}
        <section className="kt-card p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-[18px] font-semibold">
                <Utensils className="size-5 text-primary" />
                每日蛋白预算
              </h2>
              <p className="mt-1 text-[14px] text-muted-foreground">
                {target
                  ? `${target.source === "doctor" ? "医生建议目标" : "自行设定目标"} ${proteinTarget} g / 天 · 自 ${target.start_date}`
                  : "还没有设定目标"}
              </p>
            </div>
            <TargetDialog current={proteinTarget} />
          </div>

          <p className="kt-num mt-4 text-[30px] font-semibold leading-none">
            {proteinToday.toFixed(1)}
            <span className="text-[18px] font-medium text-muted-foreground"> / {proteinTarget} g</span>
          </p>
          <Progress
            value={proteinTarget ? Math.min((proteinToday / proteinTarget) * 100, 100) : 0}
            className="mt-3 h-3"
          />
          <p className="mt-2 text-[15px] text-muted-foreground">今日还剩 {remaining.toFixed(1)} g</p>

          <ul className="mt-4 divide-y divide-border">
            {(foodLogs ?? []).map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-medium">
                    {l.food_items?.name} × {Number(l.amount)}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {l.food_items?.serving_size} · 蛋白 {((l.food_items?.protein_g ?? 0) * Number(l.amount)).toFixed(1)}{" "}
                    g · 钾 {Math.round((l.food_items?.potassium_mg ?? 0) * Number(l.amount))} mg · 磷{" "}
                    {Math.round((l.food_items?.phosphorus_mg ?? 0) * Number(l.amount))} mg
                  </p>
                </div>
                <button
                  aria-label="删除记录"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={async () => {
                    await supabase.from("food_logs").delete().eq("id", l.id);
                    await queryClient.invalidateQueries();
                  }}
                >
                  <X className="size-4.5" />
                </button>
              </li>
            ))}
          </ul>

          <AddFoodDialog items={foodItems ?? []} />

          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            蛋白目标由你本人或医生设定，KidneyTrack 只做记录，不会替你决定营养目标。饮食方案的调整建议在下次复诊时向医生确认。
          </p>
        </section>

        {/* Medications */}
        <section className="kt-card p-4 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-[18px] font-semibold">
              <Pill className="size-5 text-primary" />
              药物
            </h2>
            <AddMedicationDialog />
          </div>

          <ol className="mt-4">
            {(medications ?? []).map((m, idx, arr) => (
              <li key={m.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1.5 size-3 rounded-full ${m.stop_date ? "bg-muted-foreground/40" : "bg-primary"}`}
                  />
                  {idx < arr.length - 1 ? <span className="w-px flex-1 bg-border" /> : null}
                </div>
                <div className="pb-5">
                  <p className="text-[16px] font-medium">{m.drug_name}</p>
                  <p className="text-[15px] text-muted-foreground">
                    {m.dose} · {m.frequency}
                  </p>
                  <p className="kt-num text-[13px] text-muted-foreground">
                    {m.start_date} 开始
                    {m.stop_date ? ` · ${m.stop_date} 停用` : " · 正在服用"}
                    {m.doctor ? ` · ${m.doctor}` : ""}
                  </p>
                  {m.notes ? <p className="text-[14px] text-muted-foreground">备注：{m.notes}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}

function QuickCard({
  icon,
  title,
  latest,
  latestDate,
  fields,
  noteLabel,
  onSubmit,
}: {
  icon: React.ReactNode;
  title: string;
  latest: string;
  latestDate?: string | undefined;
  fields: Array<{ key: string; label: string; unit: string }>;
  noteLabel?: string | undefined;
  onSubmit: (values: Record<string, string>) => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <div className="kt-card p-4">
      <p className="flex items-center gap-2 text-[16px] font-semibold">
        {icon}
        {title}
      </p>
      <p className="kt-num mt-2 text-[22px] font-semibold">{latest}</p>
      <p className="text-[13px] text-muted-foreground">{latestDate ? `最近记录 ${latestDate}` : "\u00a0"}</p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-3 h-11 w-full gap-1.5 text-[15px]">
            <Plus className="size-4" />
            快速记录
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl">记录{title}</DialogTitle>
            <DialogDescription className="text-[15px]">记录会保存到你的时间线。</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-[15px]">
                  {f.label}（{f.unit}）
                </Label>
                <Input
                  inputMode="decimal"
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))}
                  className="h-12 text-base"
                />
              </div>
            ))}
            {noteLabel ? (
              <div className="space-y-1.5">
                <Label className="text-[15px]">{noteLabel}</Label>
                <Input
                  value={values["note"] ?? ""}
                  onChange={(e) => setValues((p) => ({ ...p, note: e.target.value }))}
                  className="h-12 text-base"
                />
              </div>
            ) : null}
          </div>
          <Button
            className="h-12 text-base"
            onClick={async () => {
              const missing = fields.some((f) => !values[f.key] || Number.isNaN(Number(values[f.key])));
              if (missing) {
                toast.error("请填写有效数值");
                return;
              }
              if (await onSubmit(values)) {
                setValues({});
                setOpen(false);
              }
            }}
          >
            保存
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SymptomCard({
  onSubmit,
  latest,
}: {
  onSubmit: (type: string, value: number, value2?: number, unit?: string, note?: string) => Promise<boolean>;
  latest?: { note: string | null; timestamp: string } | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [severity, setSeverity] = useState("2");

  return (
    <section className="kt-card p-4">
      <p className="text-[16px] font-semibold">症状</p>
      <p className="mt-1.5 text-[15px] text-muted-foreground">
        {latest ? `${latest.timestamp.slice(0, 10)} · ${latest.note ?? ""}` : "暂无症状记录（如水肿、乏力、泡沫尿等）"}
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-3 h-11 gap-1.5 text-[15px]">
            <Plus className="size-4" />
            记录症状
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl">记录症状</DialogTitle>
            <DialogDescription className="text-[15px]">
              症状记录只作为你与医生沟通的参考，不用于判断病情。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-[15px]">症状描述</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="例如：早晨眼睑轻度水肿"
                className="min-h-24 text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[15px]">程度（1 轻 – 5 重）</Label>
              <Input
                inputMode="numeric"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </div>
          <Button
            className="h-12 text-base"
            onClick={async () => {
              if (!note.trim()) {
                toast.error("请填写症状描述");
                return;
              }
              if (await onSubmit("symptom", Number(severity) || 1, undefined, "级", note)) {
                setNote("");
                setOpen(false);
              }
            }}
          >
            保存
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function TargetDialog({ current }: { current: number }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(String(current || 44));
  const [source, setSource] = useState<"doctor" | "self">("doctor");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-11 shrink-0 text-[15px]">
          设定目标
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">每日蛋白目标</DialogTitle>
          <DialogDescription className="text-[15px]">
            目标必须由你本人或医生决定。KidneyTrack 不会自动生成营养目标。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-[15px]">目标（g / 天）</Label>
            <Input
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <div className="flex gap-2">
            {(
              [
                { key: "doctor", label: "医生建议" },
                { key: "self", label: "本人设定" },
              ] as const
            ).map((o) => (
              <button
                key={o.key}
                onClick={() => setSource(o.key)}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-[15px] font-medium ${
                  source === o.key
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <Button
          className="h-12 text-base"
          onClick={async () => {
            const n = Number(value);
            if (!n || Number.isNaN(n)) {
              toast.error("请填写有效数值");
              return;
            }
            const { error } = await supabase.from("nutrition_targets").insert({
              patient_id: DEMO_PATIENT_ID,
              protein_target_g: n,
              source,
              start_date: today(),
            });
            if (error) {
              toast.error("保存失败，请重试");
              return;
            }
            await queryClient.invalidateQueries();
            toast.success("目标已更新");
            setOpen(false);
          }}
        >
          保存
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function AddFoodDialog({ items }: { items: Array<{ id: string; name: string; serving_size: string; protein_g: number }> }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-3 h-12 w-full gap-1.5 text-[15px]">
          <Plus className="size-4" />
          添加食物
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">添加食物</DialogTitle>
          <DialogDescription className="text-[15px]">填写份数后保存，蛋白预算会自动更新。</DialogDescription>
        </DialogHeader>
        <ul className="divide-y divide-border">
          {items.map((f) => (
            <li key={f.id} className="flex items-center gap-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-medium">{f.name}</p>
                <p className="text-[13px] text-muted-foreground">
                  {f.serving_size} · 蛋白 {f.protein_g} g
                </p>
              </div>
              <Input
                inputMode="decimal"
                placeholder="份"
                value={amounts[f.id] ?? ""}
                onChange={(e) => setAmounts((p) => ({ ...p, [f.id]: e.target.value }))}
                className="h-11 w-20 text-base"
              />
            </li>
          ))}
        </ul>
        <Button
          className="h-12 text-base"
          onClick={async () => {
            const rows = Object.entries(amounts)
              .filter(([, v]) => v && !Number.isNaN(Number(v)) && Number(v) > 0)
              .map(([id, v]) => ({
                patient_id: DEMO_PATIENT_ID,
                food_item_id: id,
                amount: Number(v),
                date: today(),
              }));
            if (rows.length === 0) {
              toast.error("请填写至少一项份数");
              return;
            }
            const { error } = await supabase.from("food_logs").insert(rows);
            if (error) {
              toast.error("保存失败，请重试");
              return;
            }
            await queryClient.invalidateQueries();
            setAmounts({});
            setOpen(false);
            toast.success("已添加到今日饮食");
          }}
        >
          保存
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function AddMedicationDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    drug_name: "",
    dose: "",
    frequency: "",
    start_date: today(),
    stop_date: "",
    doctor: "",
    notes: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-11 gap-1.5 text-[15px]">
          <Plus className="size-4" />
          添加药物
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">添加药物</DialogTitle>
          <DialogDescription className="text-[15px]">
            请按医生处方填写。KidneyTrack 不会建议用药或调整剂量。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {[
            { k: "drug_name", label: "药物名称", ph: "例如 氯沙坦钾 Losartan" },
            { k: "dose", label: "剂量", ph: "例如 50 mg" },
            { k: "frequency", label: "频次", ph: "例如 每日一次" },
            { k: "doctor", label: "开药医生", ph: "例如 李医生 (肾内科)" },
          ].map((f) => (
            <div key={f.k} className="space-y-1.5">
              <Label className="text-[15px]">{f.label}</Label>
              <Input
                value={form[f.k as keyof typeof form]}
                placeholder={f.ph}
                onChange={(e) => set(f.k, e.target.value)}
                className="h-12 text-base"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[15px]">开始日期</Label>
              <Input
                type="date"
                value={form.start_date}
                onChange={(e) => set("start_date", e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[15px]">停用日期</Label>
              <Input
                type="date"
                value={form.stop_date}
                onChange={(e) => set("stop_date", e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[15px]">备注（可选）</Label>
            <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className="min-h-20 text-base" />
          </div>
        </div>
        <Button
          className="h-12 text-base"
          onClick={async () => {
            if (!form.drug_name.trim()) {
              toast.error("请填写药物名称");
              return;
            }
            const { error } = await supabase.from("medications").insert({
              patient_id: DEMO_PATIENT_ID,
              drug_name: form.drug_name,
              dose: form.dose || null,
              frequency: form.frequency || null,
              start_date: form.start_date || null,
              stop_date: form.stop_date || null,
              doctor: form.doctor || null,
              notes: form.notes || null,
            });
            if (error) {
              toast.error("保存失败，请重试");
              return;
            }
            await supabase.from("events").insert({
              patient_id: DEMO_PATIENT_ID,
              event_type: "medication",
              title: `开始服用 ${form.drug_name}`,
              description: [form.dose, form.frequency].filter(Boolean).join(" · ") || null,
              date: form.start_date || today(),
            });
            await queryClient.invalidateQueries();
            toast.success("药物已添加");
            setOpen(false);
          }}
        >
          保存
        </Button>
      </DialogContent>
    </Dialog>
  );
}
