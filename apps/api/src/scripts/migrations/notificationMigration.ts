import mongoose from "mongoose";

export const notificationMigration = async () => {
  try {
    console.log("Connected to MongoDB for schema migration...\n");

    const collection = mongoose.connection.collection("notifications");

    // 1. Defined valid fields from your current schema (including timestamps)
    const allowedFields = new Set([
      "_id",
      "tenantId",
      "recipientId",
      "actorId",
      "entityType",
      "entityId",
      "title",
      "message",
      "isRead",
      "readAt",
      "createdAt",
      "updatedAt",
      "__v",
    ]);

    // 2. Step 1: Rename `type` to `entityType`
    const renameResult = await collection.updateMany(
      { type: { $exists: true } },
      { $rename: { type: "entityType" } }
    );
    console.log(`Renamed 'type' -> 'entityType' on ${renameResult.modifiedCount} document(s).`);

    // 3. Step 2: Fetch all documents to find and remove any unlisted/legacy fields (e.g., `url`, `data`)
    const docs = await collection.find({}).toArray();
    let cleanedDocsCount = 0;

    for (const doc of docs) {
      const fieldsToRemove: Record<string, ""> = {};

      Object.keys(doc).forEach((key) => {
        if (!allowedFields.has(key)) {
          fieldsToRemove[key] = "";
        }
      });

      if (Object.keys(fieldsToRemove).length > 0) {
        await collection.updateOne(
          { _id: doc._id },
          { $unset: fieldsToRemove }
        );
        cleanedDocsCount++;
      }
    }

    console.log(`Cleaned up obsolete fields on ${cleanedDocsCount} document(s).`);

    // 4. Step 3: Ensure `entityId` defaults to null for existing docs where it's missing
    const nullEntityIdResult = await collection.updateMany(
      { entityId: { $exists: false } },
      { $set: { entityId: null } }
    );
    console.log(`Set 'entityId: null' on ${nullEntityIdResult.modifiedCount} document(s).`);

    // 5. Step 4: Drop legacy indexes and recreate new schema indexes
    const existingIndexes = await collection.indexes();
    const typeIndex = existingIndexes.find((idx) => idx.key && idx.key.type);

    if (typeIndex && typeIndex.name) {
      await collection.dropIndex(typeIndex.name);
      console.log(`Dropped legacy index: ${typeIndex.name}`);
    }

    await collection.createIndex({ recipientId: 1, isRead: 1, createdAt: -1 });
    console.log("Ensured composite index on { recipientId: 1, isRead: 1, createdAt: -1 }.");

    console.log("\nMigration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};