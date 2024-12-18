import { HealthSidebar } from "@/components/health-sidebar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-8 md:px-16 py-16">
      <HealthSidebar />
    </main>
  )
};