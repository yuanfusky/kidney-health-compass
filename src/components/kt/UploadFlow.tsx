import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, FileUp, Keyboard, Loader2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_PATIENT_ID, qk } from "@/lib/kt/data";
import { extractionProvider, confidenceLabel, type ExtractedField } from "@/lib/kt/ocr";
import { METRICS, REPORT_TYPES } from "@/lib/kt/metrics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Step = "choose" | "processing" | "confirm";

interface DraftField extends ExtractedField {
  /** value the user may have corrected */
  confirmed: string;
}

export function UploadFlow({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const t = useT();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("choose");
  const [reportType, setReportType] = useState<string>("肾功能");
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [hospital, setHospital] = useState("北京大学第一医院");
  const [sourceKind, setSourceKind] = useState<"image" | "pdf" | "manual">("image");
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<DraftField[]>([]);
  const [saving, setSaving] = useState(false);

  function reset() {
    setStep("choose");
    setFields([]);
    setFile(null);
    setSaving(false);
  }

  function close(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  function pick(kind: "image" | "pdf") {
    setSourceKind(kind);
    if (fileRef.current) {
      fileRef.current.accept = kind === "pdf" ? "application/pdf" : "image/*";
      fileRef.current.click();
    }
  }

  async function onFileChosen(f: File) {
    setFile(f);
    setStep("processing");
    const result = await extractionProvider.extract({ fileName: f.name, reportType });
    setReportDate(result.report_date);
    setHospital(result.hospital);
    setReportType(result.report_type);
    setFields(result.fields.map((x) => ({ ...x, confirmed: String(x.value) })));
    setStep("confirm");
  }

  function startManual() {
    setSourceKind("manual");
    setFile(null);
    setFields([]);
    setStep("confirm");
  }

  function addEmptyField() {
    const m = METRICS.find((x) => x.source === "lab")!;
    setFields((prev) => [
      ...prev,
      {
        canonical_name: m.canonical,
        original_name: m.labelZh,
        value: 0,
        unit: m.unit,
        reference_min: null,
        reference_max: null,
        confidence: 1,
        confirmed: "",
      },
    ]);
  }

  async function save() {
    const valid = fields.filter((f) => f.confirmed.trim() !== "" && !Number.isNaN(Number(f.confirmed)));
    if (valid.length === 0) {
      toast.error(t("请至少确认一项检查数值"));
      return;
    }
    setSaving(true);
    try {
      let filePath: string | null = null;
      if (file) {
        const path = `${DEMO_PATIENT_ID}/${crypto.randomUUID()}-${file.name}`;
        const { error } = await supabase.storage.from("reports").upload(path, file);
        if (error) throw error;
        filePath = path;
      }

      const { data: report, error: reportError } = await supabase
        .from("reports")
        .insert({
          patient_id: DEMO_PATIENT_ID,
          report_date: reportDate,
          hospital,
          report_type: reportType,
          file_url: filePath,
          source_kind: sourceKind,
          verified: true,
        })
        .select()
        .single();
      if (reportError) throw reportError;

      const { error: labError } = await supabase.from("lab_results").insert(
        valid.map((f) => ({
          report_id: report.id,
          patient_id: DEMO_PATIENT_ID,
          canonical_name: f.canonical_name,
          original_name: f.original_name,
          extracted_value: sourceKind === "manual" ? null : f.value,
          confirmed_value: Number(f.confirmed),
          original_unit: f.unit,
          normalized_value: Number(f.confirmed),
          normalized_unit: f.unit,
          reference_min: f.reference_min,
          reference_max: f.reference_max,
          confidence: sourceKind === "manual" ? null : f.confidence,
          measured_at: reportDate,
        })),
      );
      if (labError) throw labError;

      await supabase.from("events").insert({
        patient_id: DEMO_PATIENT_ID,
        event_type: "lab",
        title: t("{type}检查", { type: reportType }),
        description: t("{hospital} · 已确认 {count} 项指标", { hospital, count: valid.length }),
        date: reportDate,
      });

      await queryClient.invalidateQueries();
      toast.success(t("已保存到你的健康时间线"));
      close(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("保存失败，请重试"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFileChosen(f);
            e.target.value = "";
          }}
        />

        {step === "choose" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{t("上传检查报告")}</DialogTitle>
              <DialogDescription className="text-[15px]">
                {t("支持照片、PDF 或手动录入。识别结果需要你本人确认后才会保存。")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label className="text-[15px]">{t("报告类型")}</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map((rt) => (
                    <SelectItem key={rt} value={rt} className="text-base">
                      {t(rt)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-2 space-y-2.5">
              <Button variant="outline" className="h-14 w-full justify-start gap-3 text-base" onClick={() => pick("image")}>
                <Camera className="size-5 text-primary" />
                {t("拍照或选择图片")}
              </Button>
              <Button variant="outline" className="h-14 w-full justify-start gap-3 text-base" onClick={() => pick("pdf")}>
                <FileUp className="size-5 text-primary" />
                {t("上传 PDF 报告")}
              </Button>
              <Button variant="outline" className="h-14 w-full justify-start gap-3 text-base" onClick={startManual}>
                <Keyboard className="size-5 text-primary" />
                {t("手动录入数值")}
              </Button>
            </div>
          </>
        )}

        {step === "processing" && (
          <div className="py-10 text-center">
            <Loader2 className="mx-auto size-10 animate-spin text-primary" />
            <p className="mt-5 text-lg font-medium">{t("正在识别报告内容…")}</p>
            <p className="mt-1.5 text-[15px] text-muted-foreground">
              {t("正在读取检查项目与数值，稍后请核对识别结果。")}
            </p>
            <p className="mt-4 text-[13px] text-muted-foreground">{t("原始报告会完整保留，随时可以回看。")}</p>
          </div>
        )}

        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{t("确认识别结果")}</DialogTitle>
              <DialogDescription className="text-[15px]">
                {t("请核对每一项数值。修改后保存的是你确认的数值，AI 识别的原始值也会一并留档。")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[14px]">{t("检查日期")}</Label>
                <Input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="h-11 text-base"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[14px]">{t("报告类型")}</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_TYPES.map((rt) => (
                      <SelectItem key={rt} value={rt}>
                        {t(rt)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-[14px]">{t("医院")}</Label>
                <Input value={t(hospital)} onChange={(e) => setHospital(e.target.value)} className="h-11 text-base" />
              </div>
            </div>

            <div className="mt-2 space-y-2.5">
              {fields.map((f, idx) => {
                const conf = confidenceLabel(f.confidence);
                return (
                  <div key={idx} className="rounded-xl border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {sourceKind === "manual" ? (
                          <Select
                            value={f.canonical_name}
                            onValueChange={(v) => {
                              const m = METRICS.find((x) => x.canonical === v)!;
                              setFields((prev) =>
                                prev.map((x, i) =>
                                  i === idx
                                    ? { ...x, canonical_name: m.canonical, original_name: m.labelZh, unit: m.unit }
                                    : x,
                                ),
                              );
                            }}
                          >
                            <SelectTrigger className="h-10 w-48 text-[15px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {METRICS.filter((m) => m.source === "lab").map((m) => (
                                <SelectItem key={m.key} value={m.canonical}>
                                  {t(m.labelZh)} {m.canonical}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <>
                            <p className="text-[16px] font-medium">{f.canonical_name}</p>
                            <p className="text-[14px] text-muted-foreground">{t(f.original_name)}</p>
                          </>
                        )}
                      </div>
                      {sourceKind === "manual" ? (
                        <button
                          type="button"
                          onClick={() => setFields((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label={t("删除该项")}
                        >
                          <Trash2 className="size-4.5" />
                        </button>
                      ) : (
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium ${
                            conf.tone === "high"
                              ? "bg-positive-soft text-positive"
                              : conf.tone === "medium"
                                ? "bg-info-soft text-info"
                                : "bg-caution-soft text-caution"
                          }`}
                        >
                          {conf.text} {Math.round(f.confidence * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="mt-2.5 flex items-center gap-2">
                      <Input
                        inputMode="decimal"
                        value={f.confirmed}
                        placeholder={t("数值")}
                        onChange={(e) =>
                          setFields((prev) => prev.map((x, i) => (i === idx ? { ...x, confirmed: e.target.value } : x)))
                        }
                        className="h-12 max-w-32 text-lg"
                      />
                      <span className="text-[15px] text-muted-foreground">{f.unit}</span>
                      {sourceKind !== "manual" && String(f.value) !== f.confirmed ? (
                        <span className="ml-auto text-[13px] text-muted-foreground">{t("AI 识别值 {value}", { value: f.value })}</span>
                      ) : null}
                    </div>
                    {f.reference_min !== null || f.reference_max !== null ? (
                      <p className="mt-1.5 text-[13px] text-muted-foreground">
                        {t("参考范围 {min} – {max} {unit}", { min: f.reference_min ?? "—", max: f.reference_max ?? "—", unit: f.unit })}
                      </p>
                    ) : null}
                  </div>
                );
              })}

              {sourceKind === "manual" ? (
                <Button variant="outline" className="h-11 w-full gap-2 text-[15px]" onClick={addEmptyField}>
                  <Plus className="size-4" />
                  {t("添加检查项目")}
                </Button>
              ) : null}
            </div>

            <p className="flex items-start gap-2 rounded-lg bg-surface p-3 text-[14px] text-surface-foreground">
              <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-primary" />
              {t("KidneyTrack 只帮助整理数据，不做诊断，也不会建议调整用药。如对结果有疑问，建议在下次复诊时向医生确认。")}
            </p>

            <div className="flex gap-2.5">
              <Button variant="outline" className="h-12 flex-1 text-base" onClick={() => close(false)}>
                {t("取消")}
              </Button>
              <Button className="h-12 flex-1 text-base" onClick={save} disabled={saving}>
                {saving ? t("保存中…") : t("确认并保存")}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
