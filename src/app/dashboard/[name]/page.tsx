import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Dashboard } from "@prisma/client";

import styles from "./Dashboard.module.css";
import { Button } from "@/components/ui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { loadWidgets } from "./actions";
import WidgetRenderer from "./_components/WidgetRenderer";
import DashboardCanvas from "./_components/DashboardCanvas";

export default async function DashboardPage({
  params,
}: {
  params: { name: string };
}) {
  const name = params.name;

  if (!name) {
    return notFound();
  }

  const dashboard = await prisma.dashboard.findUnique({
    where: {
      name: name,
    },
  });

  if (!dashboard) {
    return notFound();
  }

  const widgets = await loadWidgets(dashboard.id);

  return (
    <div className="max-w-[90%] mx-auto">
      <div className="m-2 mt-4 flex justify-end gap-2">
        <Button>
          <FontAwesomeIcon icon={faPlus} />
          New Widget
        </Button>
      </div>

      <DashboardCanvas dashboard={dashboard} initialWidgets={widgets} />
    </div>
  );
}
