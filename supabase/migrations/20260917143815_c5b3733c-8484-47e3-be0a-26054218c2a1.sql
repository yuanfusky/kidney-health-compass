CREATE TABLE public.patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid,
  name text NOT NULL,
  birth_year int,
  sex text,
  diagnosis text,
  diagnosis_date date,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.family_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id uuid,
  member_name text NOT NULL,
  relation text,
  role text NOT NULL DEFAULT 'viewer',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.can_access_patient(p uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.patients pt
    WHERE pt.id = p AND (pt.owner_user_id = auth.uid() OR pt.is_demo)
  ) OR EXISTS (
    SELECT 1 FROM public.family_access fa
    WHERE fa.patient_id = p AND fa.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.can_edit_patient(p uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.patients pt
    WHERE pt.id = p AND (pt.owner_user_id = auth.uid() OR pt.is_demo)
  ) OR EXISTS (
    SELECT 1 FROM public.family_access fa
    WHERE fa.patient_id = p AND fa.user_id = auth.uid() AND fa.role IN ('patient','caregiver')
  );
$$;

CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  report_date date NOT NULL,
  hospital text,
  report_type text NOT NULL,
  file_url text,
  source_kind text NOT NULL DEFAULT 'image',
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.lab_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES public.reports(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  canonical_name text NOT NULL,
  original_name text,
  extracted_value numeric,
  confirmed_value numeric,
  original_unit text,
  normalized_value numeric,
  normalized_unit text,
  reference_min numeric,
  reference_max numeric,
  confidence numeric,
  measured_at date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  drug_name text NOT NULL,
  dose text,
  frequency text,
  start_date date,
  stop_date date,
  doctor text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  type text NOT NULL,
  value numeric NOT NULL,
  value2 numeric,
  unit text,
  note text,
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  title text NOT NULL,
  description text,
  date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.nutrition_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  protein_target_g numeric NOT NULL,
  source text NOT NULL DEFAULT 'doctor',
  start_date date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.food_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  serving_size text NOT NULL,
  serving_grams numeric,
  protein_g numeric NOT NULL,
  calories numeric,
  sodium_mg numeric,
  potassium_mg numeric,
  phosphorus_mg numeric
);

CREATE TABLE public.food_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  food_item_id uuid NOT NULL REFERENCES public.food_items(id),
  amount numeric NOT NULL DEFAULT 1,
  date date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.biopsy_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  biopsy_date date NOT NULL,
  hospital text,
  total_glomeruli int,
  globally_sclerotic_glomeruli int,
  m_score text,
  e_score text,
  s_score text,
  t_score text,
  c_score text,
  notes text,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.patients, public.family_access, public.reports, public.lab_results, public.medications, public.measurements, public.events, public.nutrition_targets, public.food_logs, public.biopsy_records TO authenticated;
GRANT SELECT ON public.food_items TO authenticated;
GRANT ALL ON public.patients, public.family_access, public.reports, public.lab_results, public.medications, public.measurements, public.events, public.nutrition_targets, public.food_items, public.food_logs, public.biopsy_records TO service_role;

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biopsy_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "patients_select" ON public.patients FOR SELECT TO authenticated USING (public.can_access_patient(id));
CREATE POLICY "patients_insert" ON public.patients FOR INSERT TO authenticated WITH CHECK (owner_user_id = auth.uid());
CREATE POLICY "patients_update" ON public.patients FOR UPDATE TO authenticated USING (public.can_edit_patient(id)) WITH CHECK (public.can_edit_patient(id));
CREATE POLICY "patients_delete" ON public.patients FOR DELETE TO authenticated USING (owner_user_id = auth.uid());

CREATE POLICY "family_select" ON public.family_access FOR SELECT TO authenticated USING (public.can_access_patient(patient_id));
CREATE POLICY "family_write" ON public.family_access FOR ALL TO authenticated USING (public.can_edit_patient(patient_id)) WITH CHECK (public.can_edit_patient(patient_id));

CREATE POLICY "reports_read" ON public.reports FOR SELECT TO authenticated USING (public.can_access_patient(patient_id));
CREATE POLICY "reports_write" ON public.reports FOR ALL TO authenticated USING (public.can_edit_patient(patient_id)) WITH CHECK (public.can_edit_patient(patient_id));

CREATE POLICY "labs_read" ON public.lab_results FOR SELECT TO authenticated USING (public.can_access_patient(patient_id));
CREATE POLICY "labs_write" ON public.lab_results FOR ALL TO authenticated USING (public.can_edit_patient(patient_id)) WITH CHECK (public.can_edit_patient(patient_id));

CREATE POLICY "meds_read" ON public.medications FOR SELECT TO authenticated USING (public.can_access_patient(patient_id));
CREATE POLICY "meds_write" ON public.medications FOR ALL TO authenticated USING (public.can_edit_patient(patient_id)) WITH CHECK (public.can_edit_patient(patient_id));

CREATE POLICY "meas_read" ON public.measurements FOR SELECT TO authenticated USING (public.can_access_patient(patient_id));
CREATE POLICY "meas_write" ON public.measurements FOR ALL TO authenticated USING (public.can_edit_patient(patient_id)) WITH CHECK (public.can_edit_patient(patient_id));

CREATE POLICY "events_read" ON public.events FOR SELECT TO authenticated USING (public.can_access_patient(patient_id));
CREATE POLICY "events_write" ON public.events FOR ALL TO authenticated USING (public.can_edit_patient(patient_id)) WITH CHECK (public.can_edit_patient(patient_id));

CREATE POLICY "nut_read" ON public.nutrition_targets FOR SELECT TO authenticated USING (public.can_access_patient(patient_id));
CREATE POLICY "nut_write" ON public.nutrition_targets FOR ALL TO authenticated USING (public.can_edit_patient(patient_id)) WITH CHECK (public.can_edit_patient(patient_id));

CREATE POLICY "food_items_read" ON public.food_items FOR SELECT TO authenticated USING (true);

CREATE POLICY "food_logs_read" ON public.food_logs FOR SELECT TO authenticated USING (public.can_access_patient(patient_id));
CREATE POLICY "food_logs_write" ON public.food_logs FOR ALL TO authenticated USING (public.can_edit_patient(patient_id)) WITH CHECK (public.can_edit_patient(patient_id));

CREATE POLICY "biopsy_read" ON public.biopsy_records FOR SELECT TO authenticated USING (public.can_access_patient(patient_id));
CREATE POLICY "biopsy_write" ON public.biopsy_records FOR ALL TO authenticated USING (public.can_edit_patient(patient_id)) WITH CHECK (public.can_edit_patient(patient_id));

CREATE POLICY "report_files_read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'reports');
CREATE POLICY "report_files_write" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'reports');