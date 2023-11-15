import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantClient = new QdrantClient({ url: process.env.QDRANT_URL });

export default qdrantClient;
