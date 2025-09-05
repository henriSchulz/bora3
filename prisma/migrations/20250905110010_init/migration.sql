/*
  Warnings:

  - Added the required column `height` to the `Widget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Widget` table without a default value. This is not possible if the table is not empty.

*/
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
    "height" REAL NOT NULL,
    "width" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "properties" JSONB NOT NULL,
    CONSTRAINT "Widget_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Widget" ("createdAt", "dashboardId", "id", "positionX", "positionY", "properties", "type", "updatedAt") SELECT "createdAt", "dashboardId", "id", "positionX", "positionY", "properties", "type", "updatedAt" FROM "Widget";
DROP TABLE "Widget";
ALTER TABLE "new_Widget" RENAME TO "Widget";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
