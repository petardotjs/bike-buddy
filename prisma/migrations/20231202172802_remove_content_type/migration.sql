/*
  Warnings:

  - You are about to drop the column `contentType` on the `PostImage` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PostImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "blob" BLOB NOT NULL,
    "altText" TEXT,
    "credit" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "postId" TEXT NOT NULL,
    CONSTRAINT "PostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostImage" ("altText", "blob", "createdAt", "credit", "id", "postId", "updatedAt") SELECT "altText", "blob", "createdAt", "credit", "id", "postId", "updatedAt" FROM "PostImage";
DROP TABLE "PostImage";
ALTER TABLE "new_PostImage" RENAME TO "PostImage";
CREATE INDEX "PostImage_postId_idx" ON "PostImage"("postId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
