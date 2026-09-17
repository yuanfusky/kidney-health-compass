/** Landing, auth, profile, biopsy and family-management wording. */
export const ACCOUNT_DICT: Record<string, string> = {
  // ---- landing page
  "KidneyTrack 肾脏健康记录 — 属于患者自己的慢性肾病档案":
    "KidneyTrack Kidney Health Record — Your Own Chronic Kidney Disease File",
  "KidneyTrack 帮助 CKD 与 IgA 肾病患者把多家医院的化验单、血压、用药和饮食记录整理成一条完整的健康时间线，并在复诊前生成清晰的就诊摘要。":
    "KidneyTrack helps CKD and IgA nephropathy patients organize lab reports, blood pressure, medications and diet records from multiple hospitals into one complete health timeline, and generates a clear visit summary before each follow-up.",
  "KidneyTrack 肾脏健康记录": "KidneyTrack Kidney Health Record",
  "把分散在各家医院的肾脏检查资料整理成一条属于你自己的健康时间线。":
    "Organize kidney test results scattered across hospitals into one health timeline that belongs to you.",
  "KidneyTrack · 慢性肾病健康记录": "KidneyTrack · Chronic Kidney Disease Health Record",
  "属于你自己的<br/>肾脏健康时间线": "Your own\nkidney health timeline",
  "多家医院、多年检查、纸质报告和手机照片，都可以整理到一处。KidneyTrack 帮助 CKD 与 IgA 肾病患者和家属看清长期变化，并为每一次复诊做好准备。":
    "Multiple hospitals, years of check-ups, paper reports and phone photos can all be organized in one place. KidneyTrack helps CKD and IgA nephropathy patients and their families see long-term changes and prepare for every follow-up.",
  "进入 KidneyTrack": "Enter KidneyTrack",
  "登录 / 注册": "Sign in / Sign up",
  "查看演示档案": "View demo record",
  "报告集中管理": "Centralized report management",
  "拍照或上传 PDF，自动识别化验数值，由你本人确认后入档。":
    "Take a photo or upload a PDF; lab values are auto-recognized and filed after you confirm them.",
  "长期趋势可视化": "Long-term trend visualization",
  "肌酐、eGFR、尿蛋白、血压随时间变化，用药事件同图标注。":
    "Creatinine, eGFR, urine protein and blood pressure over time, with medication events marked on the same chart.",
  "复诊摘要": "Visit summary",
  "一键生成近 3/6/12 个月的关键变化，以及想向医生确认的问题。":
    "Generate key changes over the last 3/6/12 months, plus questions to confirm with your doctor, with one tap.",
  "KidneyTrack 不是医生，不做诊断，也不会调整用药或替您决定营养目标。所有医疗决定请与您的医生确认。 本原型中的患者信息均为演示数据。":
    "KidneyTrack is not a doctor. It does not diagnose, adjust medications, or set nutrition targets for you. Please confirm all medical decisions with your doctor. Patient information in this prototype is demo data.",

  // ---- auth page
  "登录 KidneyTrack — 肾脏健康记录": "Sign in to KidneyTrack — Kidney Health Record",
  "登录或注册 KidneyTrack，管理属于你自己的慢性肾病健康档案。":
    "Sign in or sign up for KidneyTrack to manage your own chronic kidney disease health record.",
  "登录 KidneyTrack": "Sign in to KidneyTrack",
  "登录后查看你的肾脏健康时间线、趋势与复诊摘要。":
    "Sign in to view your kidney health timeline, trends and visit summaries.",
  "登录": "Sign in",
  "创建账号": "Create account",
  "登录后即可查看演示患者档案（王建国，IgA 肾病）。":
    "Sign in to view the demo patient record (Wang Jianguo, IgA nephropathy).",
  "邮箱": "Email",
  "密码": "Password",
  "至少 6 位": "At least 6 characters",
  "注册": "Sign up",
  "注册成功，请查看邮箱确认邮件后登录。": "Sign-up successful. Please check your email to confirm, then sign in.",
  "操作失败，请重试": "Something went wrong. Please try again.",
  "或": "or",
  "使用 Google 账号继续": "Continue with Google",
  "Google 登录失败，请重试": "Google sign-in failed. Please try again.",
  "还没有账号？立即注册": "Don't have an account? Sign up",
  "已有账号？返回登录": "Already have an account? Sign in",

  // ---- profile page
  "个人中心 — KidneyTrack": "Profile — KidneyTrack",
  "患者档案、家属共享、隐私设置、数据导出与账号删除。":
    "Patient record, family sharing, privacy settings, data export and account deletion.",
  " 年出生": " birth year",
  "确诊日期 {date}": "Diagnosed {date}",
  "本原型使用虚构演示患者数据。": "This prototype uses fictional demo patient data.",
  "IgA肾病病理": "IgA Nephropathy Pathology",
  "家属管理": "Family Management",
  "隐私设置": "Privacy settings",
  "报告文件保存在私有存储空间，只有你和你授权的家属可以访问；访问链接为临时有效链接。":
    "Report files are stored in private storage; only you and family members you authorize can access them, via temporary links.",
  "允许家属查看趋势图": "Allow family to view trend charts",
  "允许家属查看原始报告": "Allow family to view original reports",
  "数据与账号": "Data & account",
  "导出我的全部数据": "Export all my data",
  "数据已导出": "Data exported",
  "退出登录": "Sign out",
  "删除账号与数据": "Delete account & data",
  "删除账号与数据？": "Delete account & data?",
  "删除后你的健康档案、报告文件与家属共享权限都会被永久移除，且无法恢复。建议先导出数据备份。 演示档案中的数据不会被删除。":
    "Once deleted, your health record, report files and family sharing permissions will be permanently removed and cannot be recovered. We recommend exporting a backup first. Data in the demo record will not be deleted.",
  "确认删除": "Confirm deletion",
  "删除请求已提交，账号将在退出后处理": "Deletion request submitted. Your account will be processed after you sign out.",
  "KidneyTrack 是数据助手，不是医生。它可以整理记录、说明医学名词、找出缺失的检查并帮你准备复诊问题，但不会诊断疾病、 调整用药、决定营养目标或预测预后。有疑问时，建议在下次复诊时向医生确认。":
    "KidneyTrack is a data assistant, not a doctor. It can organize records, explain medical terms, spot missing tests and help you prepare visit questions, but it will not diagnose disease, adjust medications, set nutrition targets or predict prognosis. If in doubt, please confirm with your doctor at your next visit.",

  // ---- biopsy page
  "IgA肾病病理 — KidneyTrack": "IgA Nephropathy Pathology — KidneyTrack",
  "记录肾穿刺活检报告与牛津 MEST-C 分型，每个字段都有名词解释。":
    "Record kidney biopsy reports and the Oxford MEST-C classification, with an explanation for every field.",
  "结构化保存活检信息，方便复诊时与医生沟通。":
    "Keep biopsy information structured to make it easier to discuss with your doctor at your next visit.",
  "肾穿刺活检记录": "Kidney biopsy records",
  "M": "M",
  "M — 系膜细胞增生 (Mesangial hypercellularity)": "M — Mesangial hypercellularity",
  "描述肾小球系膜区细胞数量是否增多。常见记录为 M0 或 M1。":
    "Describes whether the number of cells in the glomerular mesangial area is increased. Commonly recorded as M0 or M1.",
  "E": "E",
  "E — 内皮细胞增生 (Endocapillary hypercellularity)": "E — Endocapillary hypercellularity",
  "描述毛细血管内细胞是否增多，常见记录为 E0 或 E1。":
    "Describes whether cells within capillaries are increased. Commonly recorded as E0 or E1.",
  "S": "S",
  "S — 节段性硬化 (Segmental glomerulosclerosis)": "S — Segmental glomerulosclerosis",
  "描述部分肾小球是否出现节段性硬化，常见记录为 S0 或 S1。":
    "Describes whether some glomeruli show segmental sclerosis. Commonly recorded as S0 or S1.",
  "T": "T",
  "T — 肾小管萎缩／间质纤维化 (Tubular atrophy / interstitial fibrosis)":
    "T — Tubular atrophy / interstitial fibrosis",
  "描述肾间质纤维化范围，常见记录为 T0、T1 或 T2。":
    "Describes the extent of interstitial fibrosis. Commonly recorded as T0, T1 or T2.",
  "C": "C",
  "C — 新月体 (Crescents)": "C — Crescents",
  "描述是否存在新月体形成，常见记录为 C0、C1 或 C2。":
    "Describes whether crescent formation is present. Commonly recorded as C0, C1 or C2.",
  "未填写医院": "Hospital not entered",
  "肾小球总数": "Total glomeruli",
  "球性硬化数": "Globally sclerotic glomeruli",
  "牛津分型 Oxford MEST-C": "Oxford classification (MEST-C)",
  "{label} 说明": "{label} explanation",
  "备注：{notes}": "Note: {notes}",
  "病理分型只作为记录保存，KidneyTrack 不会据此预测病情走向或预后。分型含义与后续随访计划，建议在下次复诊时向医生确认。":
    "The pathology classification is kept only as a record; KidneyTrack does not use it to predict disease course or prognosis. Please confirm the meaning of the classification and the follow-up plan with your doctor at your next visit.",
  "添加肾穿刺病理报告": "Add kidney biopsy report",
  "肾穿刺病理报告": "Kidney biopsy report",
  "按报告原文填写。每个分型字段旁的信息图标可以查看名词解释。":
    "Fill in as written on the original report. Tap the info icon next to each classification field to see its explanation.",
  "穿刺日期": "Biopsy date",
  "医院": "Hospital",
  "上传病理报告文件（可选）": "Upload pathology report file (optional)",
  "请填写穿刺日期": "Please enter the biopsy date",
  "文件上传失败，请重试": "File upload failed. Please try again.",
  "病理报告已保存": "Pathology report saved",

  // ---- family page
  "家属管理 — KidneyTrack": "Family Management — KidneyTrack",
  "管理患者、家属管理者与仅查看成员的权限。":
    "Manage permissions for the patient, family caregivers and view-only members.",
  "数据归患者本人所有，家属权限可随时调整。":
    "Data belongs to the patient; family permissions can be adjusted at any time.",
  "数据归患者本人所有": "Data belongs to the patient",
  "患者": "Patient",
  "数据所有者，可管理全部记录与权限": "Data owner; can manage all records and permissions",
  "家属管理者": "Family caregiver",
  "可上传报告、添加健康记录、查看趋势": "Can upload reports, add health records and view trends",
  "仅查看": "View only",
  "只能查看，不能修改任何记录": "Can only view; cannot modify any records",
  "移除成员": "Remove member",
  "成员已移除": "Member removed",
  "添加家属": "Add family member",
  "家属管理者可以帮你上传报告和记录数据；仅查看成员只能查看。":
    "Family caregivers can help you upload reports and record data; view-only members can only view.",
  "称呼": "Name",
  "例如 女儿": "e.g. Daughter",
  "关系（可选）": "Relation (optional)",
  "请填写称呼": "Please enter a name",
  "家属已添加": "Family member added",
};
