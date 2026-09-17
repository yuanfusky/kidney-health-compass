/** Canonical (English) biomarker names + patient-facing Chinese labels. */

export type MetricSource = "lab" | "measurement";

export interface MetricDef {
  key: string;
  /** canonical English name stored in the database */
  canonical: string;
  labelZh: string;
  unit: string;
  category: string;
  source: MetricSource;
  /** measurement.type when source === "measurement" */
  measurementType?: string;
  /** true when a lower value is generally the goal (used only for neutral wording) */
  lowerIsBetter?: boolean;
  decimals?: number;
}

export const METRICS: MetricDef[] = [
  // 肾功能
  {
    key: "creatinine",
    canonical: "Creatinine",
    labelZh: "肌酐",
    unit: "μmol/L",
    category: "肾功能",
    source: "lab",
    lowerIsBetter: true,
  },
  {
    key: "egfr",
    canonical: "eGFR",
    labelZh: "eGFR 估算滤过率",
    unit: "mL/min/1.73m²",
    category: "肾功能",
    source: "lab",
  },
  { key: "bun", canonical: "BUN", labelZh: "尿素氮", unit: "mmol/L", category: "肾功能", source: "lab", decimals: 1 },
  {
    key: "cystatinc",
    canonical: "Cystatin C",
    labelZh: "胱抑素 C",
    unit: "mg/L",
    category: "肾功能",
    source: "lab",
    decimals: 2,
  },
  // 尿蛋白
  {
    key: "up24",
    canonical: "24h Urine Protein",
    labelZh: "24 小时尿蛋白",
    unit: "g/24h",
    category: "尿蛋白",
    source: "lab",
    lowerIsBetter: true,
    decimals: 2,
  },
  {
    key: "uacr",
    canonical: "UACR",
    labelZh: "尿白蛋白/肌酐比 UACR",
    unit: "mg/g",
    category: "尿蛋白",
    source: "lab",
    lowerIsBetter: true,
  },
  {
    key: "upcr",
    canonical: "UPCR",
    labelZh: "尿蛋白/肌酐比 UPCR",
    unit: "mg/g",
    category: "尿蛋白",
    source: "lab",
    lowerIsBetter: true,
  },
  // 电解质
  { key: "k", canonical: "Potassium", labelZh: "血钾", unit: "mmol/L", category: "电解质", source: "lab", decimals: 1 },
  { key: "na", canonical: "Sodium", labelZh: "血钠", unit: "mmol/L", category: "电解质", source: "lab" },
  {
    key: "p",
    canonical: "Phosphorus",
    labelZh: "血磷",
    unit: "mmol/L",
    category: "电解质",
    source: "lab",
    decimals: 2,
  },
  { key: "ca", canonical: "Calcium", labelZh: "血钙", unit: "mmol/L", category: "电解质", source: "lab", decimals: 2 },
  // 营养
  { key: "alb", canonical: "Albumin", labelZh: "白蛋白", unit: "g/L", category: "营养", source: "lab" },
  { key: "hb", canonical: "Hemoglobin", labelZh: "血红蛋白", unit: "g/L", category: "营养", source: "lab" },
  {
    key: "weight",
    canonical: "Weight",
    labelZh: "体重",
    unit: "kg",
    category: "营养",
    source: "measurement",
    measurementType: "weight",
    decimals: 1,
  },
  // 心血管
  {
    key: "sbp",
    canonical: "Systolic BP",
    labelZh: "收缩压",
    unit: "mmHg",
    category: "心血管",
    source: "measurement",
    measurementType: "blood_pressure",
  },
  {
    key: "dbp",
    canonical: "Diastolic BP",
    labelZh: "舒张压",
    unit: "mmHg",
    category: "心血管",
    source: "measurement",
    measurementType: "blood_pressure",
  },
  {
    key: "hr",
    canonical: "Heart Rate",
    labelZh: "心率",
    unit: "bpm",
    category: "心血管",
    source: "measurement",
    measurementType: "heart_rate",
  },
];

export const METRIC_CATEGORIES = ["肾功能", "尿蛋白", "电解质", "营养", "心血管"] as const;

export function metricByKey(key: string): MetricDef | undefined {
  return METRICS.find((m) => m.key === key);
}

export function metricByCanonical(canonical: string): MetricDef | undefined {
  return METRICS.find((m) => m.canonical.toLowerCase() === canonical.toLowerCase());
}

export function labelFor(canonical: string): string {
  const m = metricByCanonical(canonical);
  return m ? `${m.labelZh} ${m.canonical}` : canonical;
}

export function formatValue(value: number | null | undefined, decimals = 0): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return value.toFixed(decimals);
}

export const REPORT_TYPES = ["肾功能", "尿液检查", "血常规", "电解质", "肾穿刺病理"] as const;
