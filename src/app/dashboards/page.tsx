import { prisma } from '@/lib/prisma';
import DashboardItem from './_components/dashboard-item';
import { Dashboard } from '@prisma/client';
import NewDashboardModal from './_components/new-dashboard-modal';


export default async function DashboardsPage() {
    const dashboards: Dashboard[] = await prisma.dashboard.findMany();

    return (
        // 1. Hauptcontainer mit Flexbox für die vertikale Anordnung
        <div className="grid  p-4 border rounded-md m-8">
            
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-5xl font-bold">Dashboards</h1>
                <NewDashboardModal />
                

            </div>
            
            {dashboards.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    No dashboards found.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {dashboards.map(dashboard => (
                        <DashboardItem key={dashboard.id} dashboard={dashboard} />
                    ))}
                </div>
            )}

        </div>
    );
}

