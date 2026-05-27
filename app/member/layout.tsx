import { BottomNav } from "@/components/member/BottomNav";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen max-w-md mx-auto">
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
