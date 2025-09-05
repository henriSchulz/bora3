import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Dashboard } from "@prisma/client";

import styles from "./Dashboard.module.css";
import { Button } from "@/components/ui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { loadWidgets } from "./actions";
import WidgetRenderer from "./_components/WidgetRenderer";



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
    <div>
      <div className="grid items-center place-items-center">
        <div className="max-w-[90%]">
          <div className="m-2 mt-4 flex justify-end gap-2">
            <Button>
              <FontAwesomeIcon icon={faPlus} />
              New Widget
            </Button>
          </div>
          <div className="p-14 border border-black relative">

            {widgets.map((widget) => (<WidgetRenderer key={widget.id} widget={widget} />))}

            <img
              src={dashboard.schematicImagePath}
              alt="Schematisches Bild"
              className={styles.schematicImage}
              id="schematicImage"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
