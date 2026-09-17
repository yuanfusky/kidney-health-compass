import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { t, useT } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: t("登录 KidneyTrack — 肾脏健康记录") },
      { name: "description", content: t("登录或注册 KidneyTrack，管理属于你自己的慢性肾病健康档案。") },
      { property: "og:title", content: t("登录 KidneyTrack") },
      { property: "og:description", content: t("登录后查看你的肾脏健康时间线、趋势与复诊摘要。") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const t = useT();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/home", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/home", replace: true });
        else toast.success(t("注册成功，请查看邮箱确认邮件后登录。"));
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/home", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("操作失败，请重试"));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(t("Google 登录失败，请重试"));
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/home", replace: true });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-primary">
          <Activity className="size-5" />
          <span className="font-semibold">KidneyTrack</span>
        </Link>

        <div className="kt-card mt-5 p-6">
          <h1 className="text-2xl font-semibold">{mode === "signin" ? t("登录") : t("创建账号")}</h1>
          <p className="mt-1.5 text-[15px] text-muted-foreground">
            {t("登录后即可查看演示患者档案（王建国，IgA 肾病）。")}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[15px]">
                {t("邮箱")}
              </Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[15px]">
                {t("密码")}
              </Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base"
                placeholder={t("至少 6 位")}
              />
            </div>
            <Button type="submit" disabled={busy} className="h-12 w-full text-base">
              {mode === "signin" ? t("登录") : t("注册")}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {t("或")}
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" onClick={google} disabled={busy} className="h-12 w-full text-base">
            {t("使用 Google 账号继续")}
          </Button>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-5 w-full text-center text-[15px] text-primary underline-offset-4 hover:underline"
          >
            {mode === "signin" ? t("还没有账号？立即注册") : t("已有账号？返回登录")}
          </button>
        </div>

        <p className="mt-5 flex items-start gap-2 px-1 text-sm text-muted-foreground">
          <Lock className="mt-0.5 size-4 shrink-0" />
          {t("您的健康数据属于您本人，未经授权不会与第三方共享。")}
        </p>
      </div>
    </main>
  );
}
