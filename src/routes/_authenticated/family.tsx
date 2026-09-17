import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Eye, Plus, ShieldCheck, Trash2, UserCog, UserRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/kt/PageHeader";
import { DEMO_PATIENT_ID, useFamily } from "@/lib/kt/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { t, useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/family")({
  head: () => ({
    meta: [
      { title: t("家属管理 — KidneyTrack") },
      { name: "description", content: t("管理患者、家属管理者与仅查看成员的权限。") },
      { property: "og:title", content: t("家属管理 — KidneyTrack") },
      { property: "og:description", content: t("数据归患者本人所有，家属权限可随时调整。") },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FamilyPage,
});

function getRoles(t: ReturnType<typeof useT>) {
  return {
    patient: { label: t("患者"), desc: t("数据所有者，可管理全部记录与权限"), Icon: UserRound },
    caregiver: { label: t("家属管理者"), desc: t("可上传报告、添加健康记录、查看趋势"), Icon: UserCog },
    viewer: { label: t("仅查看"), desc: t("只能查看，不能修改任何记录"), Icon: Eye },
  } as const;
}

function FamilyPage() {
  const t = useT();
  const ROLES = getRoles(t);
  const queryClient = useQueryClient();
  const { data: members } = useFamily();

  async function changeRole(id: string, role: string) {
    const { error } = await supabase.from("family_access").update({ role }).eq("id", id);
    if (error) {
      toast.error(t("修改失败，请重试"));
      return;
    }
    await queryClient.invalidateQueries();
    toast.success(t("权限已更新"));
  }

  return (
    <>
      <PageHeader
        title={t("家属管理")}
        subtitle={t("数据归患者本人所有")}
        showProfile={false}
        action={
          <Button asChild variant="ghost" size="icon" className="size-11">
            <Link to="/profile" aria-label={t("返回个人中心")}>
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
        }
      />

      <div className="mx-auto max-w-3xl space-y-5 px-4 py-5 md:px-8">
        <AddMemberDialog />

        <ul className="space-y-3">
          {(members ?? []).map((m) => {
            const role = ROLES[(m.role as keyof typeof ROLES) ?? "viewer"] ?? ROLES.viewer;
            const Icon = role.Icon;
            return (
              <li key={m.id} className="kt-card p-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[18px] font-medium">{t(m.member_name)}</p>
                    <p className="text-[15px] text-muted-foreground">
                      {role.label}
                      {m.relation ? ` · ${t(m.relation)}` : ""}
                    </p>
                  </div>
                  {m.role !== "patient" ? (
                    <button
                      aria-label={t("移除成员")}
                      className="text-muted-foreground hover:text-destructive"
                      onClick={async () => {
                        await supabase.from("family_access").delete().eq("id", m.id);
                        await queryClient.invalidateQueries();
                        toast.success(t("成员已移除"));
                      }}
                    >
                      <Trash2 className="size-4.5" />
                    </button>
                  ) : null}
                </div>
                <p className="mt-2 text-[14px] text-muted-foreground">{role.desc}</p>
                {m.role !== "patient" ? (
                  <div className="mt-3 flex gap-2">
                    {(["caregiver", "viewer"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => changeRole(m.id, r)}
                        className={`flex-1 rounded-lg border px-3 py-2 text-[15px] font-medium ${
                          m.role === r
                            ? "border-primary bg-accent text-accent-foreground"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {ROLES[r].label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        <p className="flex items-start gap-2 rounded-xl bg-surface p-4 text-[14px] leading-relaxed text-surface-foreground">
          <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-primary" />
          {t("您的健康数据属于您本人，未经授权不会与第三方共享。家属权限可以随时调整或撤回。")}
        </p>
      </div>
    </>
  );
}

function AddMemberDialog() {
  const t = useT();
  const ROLES = getRoles(t);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [role, setRole] = useState<"caregiver" | "viewer">("caregiver");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-14 w-full gap-2 text-[17px]">
          <Plus className="size-5" />
          {t("添加家属")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("添加家属")}</DialogTitle>
          <DialogDescription className="text-[15px]">
            {t("家属管理者可以帮你上传报告和记录数据；仅查看成员只能查看。")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-[15px]">{t("称呼")}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("例如 女儿")} className="h-12 text-base" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[15px]">{t("关系（可选）")}</Label>
            <Input value={relation} onChange={(e) => setRelation(e.target.value)} className="h-12 text-base" />
          </div>
          <div className="flex gap-2">
            {(["caregiver", "viewer"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-[15px] font-medium ${
                  role === r ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground"
                }`}
              >
                {ROLES[r].label}
              </button>
            ))}
          </div>
        </div>
        <Button
          className="h-12 text-base"
          onClick={async () => {
            if (!name.trim()) {
              toast.error(t("请填写称呼"));
              return;
            }
            const { error } = await supabase.from("family_access").insert({
              patient_id: DEMO_PATIENT_ID,
              member_name: name,
              relation: relation || null,
              role,
            });
            if (error) {
              toast.error(t("保存失败，请重试"));
              return;
            }
            await queryClient.invalidateQueries();
            toast.success(t("家属已添加"));
            setOpen(false);
          }}
        >
          {t("保存")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
