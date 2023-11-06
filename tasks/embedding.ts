import { apiClient, gptClient } from "../api";

(async () => {
  const { token } = await apiClient.authorize("embedding");

  const embeddingResponse: any = await gptClient.getEmbedding("Hawaiian pizza");

  const { embedding } = embeddingResponse.data[0];

  const answerResponse = await apiClient.answer(token, embedding);

  console.log(answerResponse);
})();
