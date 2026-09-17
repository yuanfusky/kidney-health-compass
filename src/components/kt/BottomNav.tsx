import { Link } from "@tanstack/react-router";
import { Home, FileText, TrendingUp, ClipboardList, Stethoscope } from "lucide-react";

import { useT } from "@/lib/i18n";

const TABS = [
  { to: "/home", label: "首页", Icon: Home },
  { to: "/reports", label: "报告", Icon: FileText },
  { to: "/trends", label: "趋势", Icon: TrendingUp },
  { to: "/daily", label: "日常", Icon: ClipboardList },
  { to: "/visits", label: "复诊", Icon: Stethoscope },
] as const;

export function BottomNav() {
  const t = useT();
  return (
    <nav
      className="kt-no-print fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden"
      style={{ boxShadow: "var(--shadow-nav)" }}
    >
      <ul className="mx-auto flex max-w-lg">
        {TABS.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              className="flex flex-col items-center gap-1 py-2.5 text-muted-foreground transition-colors"
              activeProps={{ className: "text-primary" }}
            >
              <Icon className="size-6" strokeWidth={1.8} />
              <span className="text-[13px] font-medium">{t(label)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

export function SideNav() {
  const t = useT();
  return (
    <nav className="kt-no-print hidden w-56 shrink-0 flex-col gap-1 border-r border-border bg-card px-3 py-6 md:flex">
      <div className="mb-5 px-3">
        <p className="text-lg font-semibold tracking-tight">KidneyTrack</p>
        <p className="text-sm text-muted-foreground">{t("肾脏健康记录")}</p>
      </div>
      {TABS.map(({ to, label, Icon }) => (
        <Link
          key={to}
          to={to}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-muted"
          activeProps={{ className: "bg-accent text-accent-foreground" }}
        >
          <Icon className="size-5" strokeWidth={1.8} />
          {t(label)}
        </Link>
      ))}
    </nav>
  );
}
