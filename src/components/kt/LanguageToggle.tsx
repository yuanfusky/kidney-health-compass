import { Languages } from "lucide-react";

import { useLang, useT, type Lang } from "@/lib/i18n";

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
];

/** Language switcher used on the profile page. */
export function LanguageToggle() {
  const { lang, setLang } = useLang();
  const t = useT();

  return (
    <section className="kt-card p-5">
      <h2 className="flex items-center gap-2 text-[18px] font-semibold">
        <Languages className="size-5 text-primary" />
        {t("界面语言")}
      </h2>
      <p className="mt-2 text-[14px] text-muted-foreground">
        {t("检验项目的英文名称在两种语言下都会保留。")}
      </p>
      <div className="mt-4 flex gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => setLang(o.value)}
            aria-pressed={lang === o.value}
            className={`flex-1 rounded-lg border px-3 py-3 text-[16px] font-medium transition-colors ${
              lang === o.value
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:bg-muted/50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </section>
  );
}
