import { apiClient } from "../api";

(async () => {
  const { token } = await apiClient.authorize("functions");

  const answerResponse = await apiClient.answer(token, {
    name: "addUser",
    description: "Adds a new user to the system",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The user's name",
        },
        surname: {
          type: "string",
          description: "The user's name",
        },
        year: {
          type: "integer",
          description: "The user's year of birth",
        },
      },
    },
  });

  console.log(answerResponse);
})();
