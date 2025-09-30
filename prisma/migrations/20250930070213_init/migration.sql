-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Widget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dashboardId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "positionX" REAL NOT NULL,
    "positionY" REAL NOT NULL,
    "height" REAL,
    "width" REAL,
    "type" TEXT NOT NULL,
    "properties" JSONB NOT NULL,
    CONSTRAINT "Widget_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Widget" ("createdAt", "dashboardId", "height", "id", "positionX", "positionY", "properties", "type", "updatedAt", "width") SELECT "createdAt", "dashboardId", "height", "id", "positionX", "positionY", "properties", "type", "updatedAt", "width" FROM "Widget";
DROP TABLE "Widget";
ALTER TABLE "new_Widget" RENAME TO "Widget";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
