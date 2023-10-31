import { apiClient } from "../api";

(async () => {
  const { token } = await apiClient.authorize("helloapi");

  const { cookie } = await apiClient.getTask(token);

  const answerResponse = await apiClient.answer(token, cookie);
  console.log(answerResponse);
})();
