import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { METRICS, metricByKey, type MetricDef } from "./metrics";

export const DEMO_PATIENT_ID = "aaaaaaaa-0000-4000-8000-000000000001";

export interface Patient {
  id: string;
  name: string;
  birth_year: number | null;
  sex: string | null;
  diagnosis: string | null;
  diagnosis_date: string | null;
}

export interface ReportRow {
  id: string;
  patient_id: string;
  report_date: string;
  hospital: string | null;
  report_type: string;
  file_url: string | null;
  source_kind: string;
  verified: boolean;
}

export interface LabRow {
  id: string;
  report_id: string | null;
  canonical_name: string;
  original_name: string | null;
  extracted_value: number | null;
  confirmed_value: number | null;
  original_unit: string | null;
  reference_min: number | null;
  reference_max: number | null;
  confidence: number | null;
  measured_at: string;
}

export interface MeasurementRow {
  id: string;
  type: string;
  value: number;
  value2: number | null;
  unit: string | null;
  note: string | null;
  timestamp: string;
}

export interface MedicationRow {
  id: string;
  drug_name: string;
  dose: string | null;
  frequency: string | null;
  start_date: string | null;
  stop_date: string | null;
  doctor: string | null;
  notes: string | null;
}

export interface EventRow {
  id: string;
  event_type: string;
  title: string;
  description: string | null;
  date: string;
}

export interface FoodItem {
  id: string;
  name: string;
  serving_size: string;
  protein_g: number;
  calories: number | null;
  sodium_mg: number | null;
  potassium_mg: number | null;
  phosphorus_mg: number | null;
}

export interface FoodLogRow {
  id: string;
  amount: number;
  date: string;
  food_item_id: string;
  food_items: FoodItem | null;
}

export const qk = {
  patient: ["patient"] as const,
  reports: ["reports"] as const,
  labs: ["labs"] as const,
  measurements: ["measurements"] as const,
  medications: ["medications"] as const,
  events: ["events"] as const,
  foodItems: ["foodItems"] as const,
  foodLogs: ["foodLogs"] as const,
  nutrition: ["nutritionTarget"] as const,
  biopsy: ["biopsy"] as const,
  family: ["family"] as const,
};

/** The prototype always works on the shared fictional demo patient. */
export function usePatient() {
  return useQuery({
    queryKey: qk.patient,
    queryFn: async (): Promise<Patient> => {
      const { data, error } = await supabase
        .from("patients")
        .select("id,name,birth_year,sex,diagnosis,diagnosis_date")
        .eq("id", DEMO_PATIENT_ID)
        .single();
      if (error) throw error;
      return data as Patient;
    },
  });
}

export function useReports() {
  return useQuery({
    queryKey: qk.reports,
    queryFn: async (): Promise<ReportRow[]> => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("patient_id", DEMO_PATIENT_ID)
        .order("report_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ReportRow[];
    },
  });
}

export function useLabs() {
  return useQuery({
    queryKey: qk.labs,
    queryFn: async (): Promise<LabRow[]> => {
      const { data, error } = await supabase
        .from("lab_results")
        .select("*")
        .eq("patient_id", DEMO_PATIENT_ID)
        .order("measured_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as LabRow[];
    },
  });
}

export function useMeasurements() {
  return useQuery({
    queryKey: qk.measurements,
    queryFn: async (): Promise<MeasurementRow[]> => {
      const { data, error } = await supabase
        .from("measurements")
        .select("*")
        .eq("patient_id", DEMO_PATIENT_ID)
        .order("timestamp", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MeasurementRow[];
    },
  });
}

export function useMedications() {
  return useQuery({
    queryKey: qk.medications,
    queryFn: async (): Promise<MedicationRow[]> => {
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("patient_id", DEMO_PATIENT_ID)
        .order("start_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as MedicationRow[];
    },
  });
}

export function useEvents() {
  return useQuery({
    queryKey: qk.events,
    queryFn: async (): Promise<EventRow[]> => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("patient_id", DEMO_PATIENT_ID)
        .order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as EventRow[];
    },
  });
}

export function useFoodItems() {
  return useQuery({
    queryKey: qk.foodItems,
    queryFn: async (): Promise<FoodItem[]> => {
      const { data, error } = await supabase.from("food_items").select("*").order("name");
      if (error) throw error;
      return (data ?? []) as FoodItem[];
    },
  });
}

export function useFoodLogs(date: string) {
  return useQuery({
    queryKey: [...qk.foodLogs, date],
    queryFn: async (): Promise<FoodLogRow[]> => {
      const { data, error } = await supabase
        .from("food_logs")
        .select("id,amount,date,food_item_id,food_items(*)")
        .eq("patient_id", DEMO_PATIENT_ID)
        .eq("date", date)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as FoodLogRow[];
    },
  });
}

export function useNutritionTarget() {
  return useQuery({
    queryKey: qk.nutrition,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nutrition_targets")
        .select("*")
        .eq("patient_id", DEMO_PATIENT_ID)
        .order("start_date", { ascending: false })
        .limit(1);
      if (error) throw error;
      return (data?.[0] ?? null) as { id: string; protein_target_g: number; source: string; start_date: string } | null;
    },
  });
}

export function useBiopsies() {
  return useQuery({
    queryKey: qk.biopsy,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("biopsy_records")
        .select("*")
        .eq("patient_id", DEMO_PATIENT_ID)
        .order("biopsy_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Array<{
        id: string;
        biopsy_date: string;
        hospital: string | null;
        total_glomeruli: number | null;
        globally_sclerotic_glomeruli: number | null;
        m_score: string | null;
        e_score: string | null;
        s_score: string | null;
        t_score: string | null;
        c_score: string | null;
        notes: string | null;
      }>;
    },
  });
}

export function useFamily() {
  return useQuery({
    queryKey: qk.family,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("family_access")
        .select("*")
        .eq("patient_id", DEMO_PATIENT_ID)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Array<{
        id: string;
        member_name: string;
        relation: string | null;
        role: string;
      }>;
    },
  });
}

/* ------------------------------------------------------------------ */
/* Series helpers                                                      */
/* ------------------------------------------------------------------ */

export interface SeriesPoint {
  date: string;
  value: number;
  reportId?: string | null;
  unit: string;
}

export function buildSeries(
  metric: MetricDef,
  labs: LabRow[] | undefined,
  measurements: MeasurementRow[] | undefined,
): SeriesPoint[] {
  if (metric.source === "lab") {
    return (labs ?? [])
      .filter((l) => l.canonical_name === metric.canonical)
      .map((l) => ({
        date: l.measured_at,
        value: Number(l.confirmed_value ?? l.extracted_value ?? 0),
        reportId: l.report_id,
        unit: l.original_unit ?? metric.unit,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
  const type = metric.measurementType!;
  return (measurements ?? [])
    .filter((m) => m.type === type)
    .map((m) => ({
      date: m.timestamp.slice(0, 10),
      value: Number(metric.key === "dbp" ? (m.value2 ?? 0) : m.value),
      unit: m.unit ?? metric.unit,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function filterByRange(points: SeriesPoint[], months: number | "all"): SeriesPoint[] {
  if (months === "all") return points;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  const iso = cutoff.toISOString().slice(0, 10);
  return points.filter((p) => p.date >= iso);
}

export function latestAndPrevious(points: SeriesPoint[]) {
  const latest = points[points.length - 1];
  const previous = points[points.length - 2];
  return { latest, previous };
}

export function allMetricKeys(): string[] {
  return METRICS.map((m) => m.key);
}

export function requireMetric(key: string): MetricDef {
  const m = metricByKey(key);
  if (!m) throw new Error(`Unknown metric ${key}`);
  return m;
}
