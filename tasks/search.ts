import { apiClient } from "../api";
import qdrantClient from "../api/qdrant";
import { embeddings } from "../api/langchain";

export const UW_NEWS = "https://unknow.news/archiwum.json";
export const COLLECTION_NAME = "UW_NEWS";

(async () => {
  const { token } = await apiClient.authorize("search");
  const { question: query } = await apiClient.getTask(token);

  console.log({ query });

  const queryEmbedding = await embeddings.embedQuery(query);

  const search = await qdrantClient.search(COLLECTION_NAME, {
    vector: queryEmbedding,
    limit: 1,
    filter: {
      must: [
        {
          key: "source",
          match: {
            value: UW_NEWS,
          },
        },
      ],
    },
  });

  console.log({ search });

  const answerResponse = await apiClient.answer(token, search[0]?.payload?.url);
  console.log(answerResponse);
})();
