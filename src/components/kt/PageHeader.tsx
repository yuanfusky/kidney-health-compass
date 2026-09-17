import { Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
  showProfile = true,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  showProfile?: boolean;
}) {
  return (
    <header className="kt-no-print sticky top-0 z-30 border-b border-border bg-background/90 px-4 py-3.5 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-4xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[22px] font-semibold leading-tight">{title}</h1>
          {subtitle ? <p className="truncate text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {action}
        {showProfile ? (
          <Link
            to="/profile"
            aria-label="个人中心"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-primary"
          >
            <UserRound className="size-5" />
          </Link>
        ) : null}
      </div>
    </header>
  );
}
