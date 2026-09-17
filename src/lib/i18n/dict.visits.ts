export const VISITS_DICT: Record<string, string> = {
  "复诊准备 — KidneyTrack": "Visit prep — KidneyTrack",
  "生成近 3/6/12 个月的关键指标变化、治疗变化，以及想向医生确认的问题。":
    "Generate key metric changes, treatment changes, and questions to confirm with your doctor over the last 3/6/12 months.",
  "生成一页式就诊摘要": "Generate a one-page visit summary",
  "一页式就诊摘要，方便与医生沟通。": "A one-page visit summary to help you talk with your doctor.",

  "最近3个月": "Last 3 months",
  "最近6个月": "Last 6 months",
  "最近12个月": "Last 12 months",

  "当前尿蛋白控制目标是多少？": "What is my current urine protein control target?",
  "目前蛋白摄入目标是否仍然合适？": "Is my current protein intake target still appropriate?",
  "体重持续下降是否需要营养干预？": "Does my continued weight loss need nutritional attention?",
  "下一次应该复查哪些指标？": "Which metrics should I recheck at the next visit?",
  "现在的血压目标范围是多少？": "What is my current target blood pressure range?",

  "该区间内没有记录": "No record in this range",

  "准备下一次复诊": "Prepare for next visit",
  "选择摘要覆盖的时间范围。": "Choose the time range the summary covers.",

  "就诊摘要 · 近 {months} 个月": "Visit summary · last {months} months",
  " 年出生": " (born)",
  "生成日期 {date}": "Generated on {date}",

  "关键指标变化": "Key metric changes",
  "所有数值均来自你确认过的报告与记录，可在报告页查看来源。":
    "All values come from reports and records you have confirmed; see the Reports page for sources.",

  "治疗变化": "Treatment changes",
  "该区间内没有记录到用药变化。": "No medication changes recorded in this range.",
  "目前在服药物": "Current medications",

  "{drug} 于 {date} 开始（{dose} {frequency}）": "{drug} started on {date} ({dose} {frequency})",
  "{drug} 于 {date} 停用": "{drug} stopped on {date}",

  "营养和生活状态": "Nutrition and lifestyle",
  "体重在过去 {months} 个月基本稳定（{value} kg）。": "Weight has been stable over the past {months} months ({value} kg).",
  "体重在过去 {months} 个月下降 {diff} kg（{from} → {to} kg）。":
    "Weight decreased by {diff} kg over the past {months} months ({from} → {to} kg).",
  "体重在过去 {months} 个月上升 {diff} kg（{from} → {to} kg）。":
    "Weight increased by {diff} kg over the past {months} months ({from} → {to} kg).",
  "每日蛋白目标 {grams} g（{source}，自 {date}）。": "Daily protein target {grams} g ({source}, since {date}).",
  "医生建议": "doctor-recommended",
  "本人设定": "self-set",

  "建议向医生确认的问题": "Questions to confirm with your doctor",

  "本摘要仅整理你已记录的数据，不包含诊断、预后判断或用药建议。所有治疗与营养决定，建议在下次复诊时向医生确认。":
    "This summary only organizes the data you have recorded. It does not include diagnosis, prognosis, or medication advice. Please confirm all treatment and nutrition decisions with your doctor at your next visit.",

  "导出医生摘要": "Export summary for doctor",
  "分享给家属": "Share with family",

  "KidneyTrack 就诊摘要（近 {months} 个月）": "KidneyTrack visit summary (last {months} months)",
  "关键指标变化：": "Key metric changes:",
  "治疗变化：": "Treatment changes:",
  "无变化": "No changes",
  "想向医生确认的问题：": "Questions to confirm with your doctor:",
  "KidneyTrack 就诊摘要": "KidneyTrack visit summary",
  "摘要已复制，可以粘贴发送给家属": "Summary copied — you can paste and send it to family",

  // ---- UploadFlow
  "上传检查报告": "Upload a lab report",
  "支持照片、PDF 或手动录入。识别结果需要你本人确认后才会保存。":
    "Supports photos, PDFs, or manual entry. Extracted results are only saved after you confirm them.",
  "报告类型": "Report type",
  "拍照或选择图片": "Take a photo or choose an image",
  "上传 PDF 报告": "Upload a PDF report",
  "手动录入数值": "Enter values manually",
  "正在识别报告内容…": "Reading report content…",
  "正在读取检查项目与数值，稍后请核对识别结果。": "Extracting test items and values — please review the results afterward.",
  "原始报告会完整保留，随时可以回看。": "The original report is kept in full and can be reviewed anytime.",
  "确认识别结果": "Confirm extracted results",
  "请核对每一项数值。修改后保存的是你确认的数值，AI 识别的原始值也会一并留档。":
    "Please review each value. The value you confirm is what gets saved; the AI-extracted original value is also kept on file.",
  "检查日期": "Test date",
  "医院": "Hospital",
  "删除该项": "Delete this item",
  "数值": "Value",
  "AI 识别值 {value}": "AI-extracted value {value}",
  "参考范围 {min} – {max} {unit}": "Reference range {min} – {max} {unit}",
  "添加检查项目": "Add test item",
  "KidneyTrack 只帮助整理数据，不做诊断，也不会建议调整用药。如对结果有疑问，建议在下次复诊时向医生确认。":
    "KidneyTrack only helps organize your data. It does not diagnose or suggest medication changes. If you have questions about a result, please confirm with your doctor at your next visit.",
  "保存中…": "Saving…",
  "确认并保存": "Confirm and save",
  "请至少确认一项检查数值": "Please confirm at least one test value",
  "保存失败，请重试": "Save failed — please try again",
  "已保存到你的健康时间线": "Saved to your health timeline",

  "{type}检查": "{type} test",
  "{hospital} · 已确认 {count} 项指标": "{hospital} · confirmed {count} items",

  "识别可信度高": "High confidence",
  "识别可信度中等": "Medium confidence",
  "请仔细核对": "Please review carefully",

  // OCR preset original_name labels
  "肌酐 Cr": "Creatinine (Cr)",
  "eGFR (CKD-EPI)": "eGFR (CKD-EPI)",
  "尿素氮 BUN": "Urea nitrogen (BUN)",
  "血钾 K": "Potassium (K)",
  "白蛋白 ALB": "Albumin (ALB)",
  "24小时尿蛋白定量": "24-hour urine protein",
  "尿白蛋白/肌酐比": "Urine albumin/creatinine ratio",
  "尿蛋白/肌酐比": "Urine protein/creatinine ratio",
  "血红蛋白 HGB": "Hemoglobin (HGB)",
  "血钠 Na": "Sodium (Na)",
  "血磷 P": "Phosphorus (P)",
  "血钙 Ca": "Calcium (Ca)",
};
