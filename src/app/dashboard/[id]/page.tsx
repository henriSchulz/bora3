import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";


import { loadWidgets } from "./actions";
import DashboardCanvas from "./_components/dashboard-canvas";
import NewWidgetModal from "./_components/modals/new-widget-modal";
import { Dashboard } from "@prisma/client";

export default async function DashboardPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  if (!id) {
    return notFound();
  }

  const dashboard = await prisma.dashboard.findUnique({
    where: {id}
  });

  if (!dashboard) {
    return notFound();
  }

  const widgets = await loadWidgets(dashboard.id);

  return (
    <div className="max-w-[90%] mx-auto">
      <div className="m-2 mt-4 flex justify-end gap-2">
       <NewWidgetModal dashboard={dashboard} />
      </div>

      <DashboardCanvas dashboard={dashboard} initialWidgets={widgets} />
    </div>
  );
}
