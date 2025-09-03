/*
  Warnings:

  - Added the required column `name` to the `Dashboard` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dashboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "schematicImagePath" TEXT NOT NULL
);
INSERT INTO "new_Dashboard" ("id", "schematicImagePath") SELECT "id", "schematicImagePath" FROM "Dashboard";
DROP TABLE "Dashboard";
ALTER TABLE "new_Dashboard" RENAME TO "Dashboard";
CREATE UNIQUE INDEX "Dashboard_name_key" ON "Dashboard"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
