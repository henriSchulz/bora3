"use client";

import { Dashboard } from "@prisma/client";


export default function DashboardItem({dashboard}: {dashboard: Dashboard}) {

    return <div className=" p-2 border border-gray-300 rounded-md">


        <h2 className="text-lg font-bold mb-2">{dashboard.name}</h2>
        <div className="mb-2">
            <img src={dashboard.schematicImagePath || '/placeholder.png'} alt={dashboard.name} className="w-full h-auto" />
        </div>
        
        <div className="text-sm text-gray-600">Created at: {new Date(dashboard.createdAt).toLocaleDateString()}</div>



    </div>

}