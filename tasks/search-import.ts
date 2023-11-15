/**
 * This script imports data from UW_NEWS archive to Qdrant.
 * Run it once before running `search.ts` task.
 */
import { v4 } from "uuid";
import qdrantClient from "../api/qdrant";
import { embeddings } from "../api/langchain";

export const UW_NEWS = "https://unknow.news/archiwum.json";
export const COLLECTION_NAME = "UW_NEWS";

type ArchivedLink = {
  title: string;
  url: string;
  info: string;
  date: string;
};

type Metadata = {
  source: string;
  summary: string;
  uuid: string;
};

type Point = {
  vector: number[];
  payload: Metadata;
  id: string;
};

(async () => {
  const collectionsResult = await qdrantClient.getCollections();

  const collection = collectionsResult.collections.find(
    (collection) => collection.name === COLLECTION_NAME
  );

  if (collection) {
    console.log(
      `Collection ${COLLECTION_NAME} exists. See if it has data. If not remove it and restart this script.`
    );

    process.exit(0);
  }

  const archiveResponse = await fetch(UW_NEWS);
  const archivedLinks: ArchivedLink[] = await archiveResponse.json();

  console.log(`${COLLECTION_NAME} size: ${archivedLinks.length}`);

  const mappedArchive: (ArchivedLink & { metadata: Metadata })[] =
    archivedLinks.map((archiveDoc) => ({
      ...archiveDoc,
      metadata: {
        source: UW_NEWS,
        title: archiveDoc.title,
        summary: archiveDoc.info,
        url: archiveDoc.url,
        uuid: v4(),
      },
    }));

  const points: Point[] = [];
  for (const doc of mappedArchive.slice(0, 300)) {
    const [embedding] = await embeddings.embedDocuments([doc.info]);

    const point = {
      id: doc.metadata.uuid,
      payload: doc.metadata,
      vector: embedding,
    };

    console.log(`Embedding ${doc.title}`);

    points.push(point);
  }

  await qdrantClient.createCollection(COLLECTION_NAME, {
    vectors: {
      size: 1536,
      distance: "Cosine",
      on_disk: true,
    },
  });

  console.log(
    `Collection ${COLLECTION_NAME} created\nUpserting ${points.length} points...`
  );

  await qdrantClient.upsert(COLLECTION_NAME, {
    wait: true,
    batch: {
      ids: points.map((point) => point.id),
      vectors: points.map((point) => point.vector),
      payloads: points.map((point) => point.payload),
    },
  });

  console.log("Done 💪");
})();
