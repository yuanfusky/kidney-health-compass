# Build a responsive web app prototype for a patient-owned chronic kidney disease health record

Build a responsive web app prototype for a patient-owned chronic kidney disease health record.

Working product name: KidneyTrack

Primary market: China

Primary language of the UI: Simplified Chinese

Secondary English labels may be used for medical biomarkers.

PRODUCT POSITIONING

This is NOT an AI doctor and should not diagnose disease or recommend medication changes.

The product is a personal longitudinal kidney health record for CKD and IgA nephropathy patients and their families.

The core problem is that kidney patients often receive care from multiple hospitals over many years. Their lab reports, biopsy reports, blood pressure records, medication history, and nutrition data are scattered across hospital apps, paper reports, phone photos, and family messages.

The app should allow the patient to create a single patient-owned timeline of their kidney disease.

The core workflow is:

Upload report

→ extract structured lab data

→ user confirms the extracted values

→ data is added to the patient's timeline

→ trends are visualized

→ medications and important events can be overlaid

→ before a doctor visit, the app generates a concise visit summary.

TECH STACK

Use:

- React

- TypeScript

- Tailwind CSS

- shadcn/ui

- Supabase for authentication, database, and file storage

Build a real functional prototype, not only static mockups.

If real OCR is not available yet, create a mock OCR extraction flow with realistic demo data and design the architecture so a real OCR/LLM service can replace it later.

Use fake/demo patient data only.

DESIGN DIRECTION

The interface should feel:

- calm

- trustworthy

- medically professional

- modern

- not overly clinical

- easy for middle-aged and elderly users

Use large readable typography and clear spacing.

Use a neutral white/slate background with restrained teal or blue-green accents.

Avoid overly colorful health dashboards.

Mobile-first design, but responsive on desktop.

BOTTOM NAVIGATION

Use five main tabs:

1. 首页

2. 报告

3. 趋势

4. 日常

5. 复诊

PAGE 1 — DASHBOARD / 首页

Create a patient health overview.

Top section:

“肾脏健康概览”

Show latest values for:

- eGFR

- 肌酐 Creatinine

- 尿蛋白 / UACR / UPCR

- 血压

- 体重

Each card should show:

- latest value

- unit

- date

- change versus previous measurement

Do NOT display scary medical warnings.

Below the cards show a kidney function trend chart.

Default chart:

Creatinine over time.

Allow switching between:

- Creatinine

- eGFR

- Proteinuria

- Weight

- Blood Pressure

Time filters:

- 3个月

- 6个月

- 1年

- 全部

Below the chart show:

“最近事件”

Example demo events:

2026-09-01

肾功能检查

Creatinine 140 μmol/L

2026-08-15

开始新的饮食方案

2026-07-20

药物调整

The timeline should visually combine lab results, medications, lifestyle events and doctor visits.

PAGE 2 — REPORTS / 报告

Show a chronological list of uploaded reports.

Each report card should include:

- date

- hospital

- report type

- number of extracted biomarkers

- verification state

Example report types:

- 肾功能

- 尿液检查

- 血常规

- 电解质

- 肾穿刺病理

Include a prominent button:

“上传检查报告”

UPLOAD FLOW

Allow:

- image upload

- PDF upload

- manual entry

After upload show an OCR processing screen.

Then open:

“确认识别结果”

Example extracted fields:

Creatinine

140

μmol/L

eGFR

52

mL/min/1.73m²

Potassium

4.3

mmol/L

Albumin

41

g/L

Each value must be editable.

Every extracted field should show an OCR confidence indicator.

The user must confirm the results before they are saved.

IMPORTANT DATA PROVENANCE RULE

Each saved measurement must retain:

1. original report

2. AI extracted value

3. user confirmed value

When clicking any point in a chart, the user should be able to open the source report.

PAGE 3 — TRENDS / 趋势

Create categories:

肾功能

- Creatinine

- eGFR

- BUN

- Cystatin C

尿蛋白

- 24h urine protein

- UACR

- UPCR

电解质

- Potassium

- Sodium

- Phosphorus

- Calcium

营养

- Albumin

- Hemoglobin

- Weight

心血管

- Systolic BP

- Diastolic BP

- Heart Rate

Users should be able to select one or two metrics and overlay them on a timeline.

Also allow medication events to appear as vertical markers on charts.

Example:

“Losartan started”

The goal is to help the patient understand what changed over months and years.

PAGE 4 — DAILY / 日常

Create sections for:

血压

体重

心率

运动

药物

症状

Allow quick manual entry.

Medication module:

Each medication should include:

- name

- dose

- frequency

- start date

- stop date

- prescribing doctor

- optional note

Show medication history on a timeline.

Add a simple nutrition card:

“每日蛋白预算”

The protein target must be USER-DEFINED OR DOCTOR-PRESCRIBED.

Never have AI decide the protein target.

Example:

医生建议目标

44 g / day

Today:

27 / 44 g

17 g remaining

Use a progress bar.

Create a small demo Chinese food database containing:

- 米饭

- 馒头

- 面条

- 鸡蛋清

- 牛肉

- 鸡肉

- 鲈鱼

- 虾

- 豆腐

- 牛奶

For each food store:

- serving size

- protein

- calories

- sodium

- potassium

- phosphorus

Allow a user to add food and update the daily protein budget.

This is a tracking tool, not a nutrition prescription tool.

PAGE 5 — VISITS / 复诊

Create a primary button:

“准备下一次复诊”

Allow the user to choose:

最近3个月

最近6个月

最近12个月

Generate a structured doctor visit summary.

Sections:

关键指标变化

Example:

Creatinine

132 → 140 μmol/L

Weight

66 → 63 kg

Proteinuria

0.8 → 0.5 g/day

治疗变化

Example:

Losartan started in May 2026

营养和生活状态

Example:

Weight decreased by 3 kg over six months.

建议向医生确认的问题

Example questions:

- 当前尿蛋白控制目标是多少？

- 目前蛋白摄入目标是否仍然合适？

- 体重持续下降是否需要营养干预？

- 下一次应该复查哪些指标？

IMPORTANT:

These questions should help the patient communicate with the doctor.

Do NOT recommend medication changes or diagnose disease.

Add buttons:

“导出医生摘要”

“分享给家属”

Create a clean one-page printable summary.

IGA NEPHROPATHY MODULE

Add a secondary page accessible from the patient profile:

“IgA肾病病理”

Allow the user to upload a kidney biopsy report.

Structure these fields:

- biopsy date

- hospital

- total glomeruli

- globally sclerotic glomeruli

- Oxford MEST-C

Fields:

M

E

S

T

C

Each field should have a small information icon explaining what the term means.

Do NOT automatically predict prognosis.

FAMILY SHARING

Create three roles:

Patient

Caregiver

Viewer

Patient owns the data.

Caregiver can:

- upload reports

- add health records

- view trends

Viewer can only view.

Create a family management page.

Example:

爸爸

患者

妈妈

家属管理者

女儿

家属管理者

PRIVACY AND SAFETY

The app handles sensitive health information.

Include:

- authentication

- secure private storage

- permissions

- data export

- account deletion

- clear privacy settings

Add a visible statement:

“您的健康数据属于您本人，未经授权不会与第三方共享。”

AI SAFETY PRINCIPLES

AI is a data assistant, not a doctor.

AI may:

- summarize trends

- explain medical terminology

- organize records

- identify missing data

- generate questions for the next doctor visit

AI must NOT:

- prescribe medication

- change medication dosage

- determine nutrition targets

- diagnose disease

- predict dialysis timing

- give definitive prognosis

When uncertainty exists, use language such as:

“建议在下次复诊时向医生确认。”

DATABASE MODEL

Create Supabase tables for:

users

patients

- id

- name

- birth_year

- sex

- diagnosis

- diagnosis_date

reports

- id

- patient_id

- report_date

- hospital

- report_type

- file_url

lab_results

- id

- report_id

- patient_id

- canonical_name

- original_name

- extracted_value

- confirmed_value

- original_unit

- normalized_value

- normalized_unit

- reference_min

- reference_max

- confidence

medications

- id

- patient_id

- drug_name

- dose

- frequency

- start_date

- stop_date

- notes

measurements

- id

- patient_id

- type

- value

- unit

- timestamp

events

- id

- patient_id

- event_type

- title

- description

- date

nutrition_targets

- id

- patient_id

- protein_target_g

- source

- start_date

food_items

- id

- name

- serving_size

- protein_g

- calories

- sodium_mg

- potassium_mg

- phosphorus_mg

food_logs

- id

- patient_id

- food_item_id

- amount

- date

biopsy_records

- id

- patient_id

- biopsy_date

- hospital

- total_glomeruli

- globally_sclerotic_glomeruli

- M

- E

- S

- T

- C

family_access

- id

- patient_id

- user_id

- role

Create realistic fake data for a fictional IgA nephropathy patient so every screen is populated.

IMPORTANT UX RULES

1. Never show a lab result without its date and unit.

2. Always preserve the original report.

3. AI extracted results must be confirmed by the user.

4. Every chart point should link back to its source.

5. Do not use red alarm styling for minor abnormalities.

6. Prioritize longitudinal trends over single abnormal values.

7. Make the interface understandable for both patients and caregivers.

8. Use Chinese labels for patient-facing UI.

9. Use standard English biomarker names internally.

10. Keep the MVP focused on data organization, longitudinal trends and visit preparation.

Build the complete first prototype with functional navigation, Supabase schema, demo data, charts, report upload flow, confirmation flow and visit summary UI.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/465cdce8-3570-4a35-8932-f97c952cda6c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
