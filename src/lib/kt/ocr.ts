/**
 * OCR / extraction layer.
 *
 * The prototype ships a mock provider that returns realistic demo values.
 * A real OCR + LLM service only needs to implement `ExtractionProvider`
 * and be swapped in `extractionProvider` below — no UI changes required.
 */

import { t } from "@/lib/i18n";

export interface ExtractedField {
  canonical_name: string;
  original_name: string;
  value: number;
  unit: string;
  reference_min: number | null;
  reference_max: number | null;
  /** 0 - 1 */
  confidence: number;
}

export interface ExtractionResult {
  report_date: string;
  hospital: string;
  report_type: string;
  fields: ExtractedField[];
}

export interface ExtractionProvider {
  name: string;
  extract(input: { fileName?: string; reportType?: string }): Promise<ExtractionResult>;
}

const PRESETS: Record<string, ExtractedField[]> = {
  肾功能: [
    {
      canonical_name: "Creatinine",
      original_name: "肌酐 Cr",
      value: 140,
      unit: "μmol/L",
      reference_min: 59,
      reference_max: 104,
      confidence: 0.96,
    },
    {
      canonical_name: "eGFR",
      original_name: "eGFR (CKD-EPI)",
      value: 52,
      unit: "mL/min/1.73m²",
      reference_min: 90,
      reference_max: null,
      confidence: 0.91,
    },
    {
      canonical_name: "BUN",
      original_name: "尿素氮 BUN",
      value: 8.4,
      unit: "mmol/L",
      reference_min: 3.1,
      reference_max: 8,
      confidence: 0.88,
    },
    {
      canonical_name: "Potassium",
      original_name: "血钾 K",
      value: 4.3,
      unit: "mmol/L",
      reference_min: 3.5,
      reference_max: 5.3,
      confidence: 0.94,
    },
    {
      canonical_name: "Albumin",
      original_name: "白蛋白 ALB",
      value: 41,
      unit: "g/L",
      reference_min: 40,
      reference_max: 55,
      confidence: 0.72,
    },
  ],
  尿液检查: [
    {
      canonical_name: "24h Urine Protein",
      original_name: "24小时尿蛋白定量",
      value: 0.5,
      unit: "g/24h",
      reference_min: 0,
      reference_max: 0.15,
      confidence: 0.9,
    },
    {
      canonical_name: "UACR",
      original_name: "尿白蛋白/肌酐比",
      value: 290,
      unit: "mg/g",
      reference_min: 0,
      reference_max: 30,
      confidence: 0.83,
    },
    {
      canonical_name: "UPCR",
      original_name: "尿蛋白/肌酐比",
      value: 520,
      unit: "mg/g",
      reference_min: 0,
      reference_max: 150,
      confidence: 0.69,
    },
  ],
  血常规: [
    {
      canonical_name: "Hemoglobin",
      original_name: "血红蛋白 HGB",
      value: 127,
      unit: "g/L",
      reference_min: 130,
      reference_max: 175,
      confidence: 0.95,
    },
    {
      canonical_name: "Albumin",
      original_name: "白蛋白 ALB",
      value: 41,
      unit: "g/L",
      reference_min: 40,
      reference_max: 55,
      confidence: 0.86,
    },
  ],
  电解质: [
    {
      canonical_name: "Potassium",
      original_name: "血钾 K",
      value: 4.3,
      unit: "mmol/L",
      reference_min: 3.5,
      reference_max: 5.3,
      confidence: 0.95,
    },
    {
      canonical_name: "Sodium",
      original_name: "血钠 Na",
      value: 139,
      unit: "mmol/L",
      reference_min: 137,
      reference_max: 147,
      confidence: 0.93,
    },
    {
      canonical_name: "Phosphorus",
      original_name: "血磷 P",
      value: 1.42,
      unit: "mmol/L",
      reference_min: 0.85,
      reference_max: 1.51,
      confidence: 0.79,
    },
    {
      canonical_name: "Calcium",
      original_name: "血钙 Ca",
      value: 2.26,
      unit: "mmol/L",
      reference_min: 2.11,
      reference_max: 2.52,
      confidence: 0.87,
    },
  ],
};

export const mockExtractionProvider: ExtractionProvider = {
  name: "mock-ocr-v1",
  async extract({ reportType }) {
    // Simulated processing latency of a real OCR / LLM pipeline.
    await new Promise((resolve) => setTimeout(resolve, 2200));
    const type = reportType && PRESETS[reportType] ? reportType : "肾功能";
    const preset = PRESETS[type] ?? [];
    return {
      report_date: new Date().toISOString().slice(0, 10),
      hospital: "北京大学第一医院",
      report_type: type,
      fields: preset.map((f) => ({ ...f })),
    };
  },
};

export const extractionProvider: ExtractionProvider = mockExtractionProvider;

export function confidenceLabel(c: number): { text: string; tone: "high" | "medium" | "low" } {
  if (c >= 0.9) return { text: t("识别可信度高"), tone: "high" };
  if (c >= 0.75) return { text: t("识别可信度中等"), tone: "medium" };
  return { text: t("请仔细核对"), tone: "low" };
}
