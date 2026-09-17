import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav, SideNav } from "@/components/kt/BottomNav";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AppShell,
});

function AppShell() {
  return (
    <div className="flex min-h-screen bg-background">
      <SideNav />
      <div className="min-w-0 flex-1 pb-24 md:pb-8">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
