-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dashboard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "schematicImagePath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Dashboard" ("id", "name", "schematicImagePath") SELECT "id", "name", "schematicImagePath" FROM "Dashboard";
DROP TABLE "Dashboard";
ALTER TABLE "new_Dashboard" RENAME TO "Dashboard";
CREATE UNIQUE INDEX "Dashboard_name_key" ON "Dashboard"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
