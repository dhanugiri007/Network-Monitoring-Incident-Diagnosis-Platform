import MonitorDetail from "@/features/monitors/components/MonitorDetail";

export default async function MonitorDetailPage({ params }) {
  const { id } = await params; // Next.js 15+ requires awaiting params
  return <MonitorDetail id={id} />;
}