import OpenAI from "openai";

import { apiClient, gptClient } from "../api";
import { ChatCompletionMessage } from "../api/types";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";
import { parse } from "dotenv";

interface ParsedPerson {
  property: string;
  formalName: string;
  surname: string;
}

const openai = new OpenAI({
  apiKey: process.env.GPT_API_KEY!,
});

async function parsePerson(question: string): Promise<ParsedPerson> {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: question,
    },
  ];

  const tools: ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "get_requested_property",
        description:
          "Zwraca informację na temat tego o co jest pytanie oraz formalne imię i nazwisko osoby o którą pyta użytkownik.",
        parameters: {
          type: "object",
          properties: {
            property: {
              type: "string",
              description:
                "Zwraca informację czy pytanie jest o kolor (color), ulubione jedzenie (food) czy o miejsce zamieszkania (place of residence).",
              enum: ["color", "food", "place_of_residence"],
            },
            formalName: {
              type: "string",
              description:
                "Zwraca pełne, formalne imię, na przykład Tomek => Tomasz, Krysia => Krystyna, Asia => Joanna",
            },
            surname: {
              type: "string",
              description: "Zwraca nazwisko osoby z pytania.",
            },
          },
          required: ["property", "formalName", "surname"],
        },
      },
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages,
    tools,
    tool_choice: "auto",
  });
  const responseMessage = response.choices[0].message;

  const toolCalls = responseMessage.tool_calls;

  let parsedPerson: ParsedPerson;

  if (toolCalls) {
    for (const toolCall of toolCalls) {
      const { name: functionName } = toolCall.function;

      if (functionName === "get_requested_property") {
        parsedPerson = JSON.parse(toolCall.function.arguments) as ParsedPerson;
      }
    }
  }

  return parsedPerson!;
}

async function getSophisticatedAnswer(
  personAbout: string,
  propertyName: string
): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: personAbout,
    },
  ];

  const tools: ChatCompletionTool[] =
    propertyName === "food"
      ? [
          {
            type: "function",
            function: {
              name: "get_favorite_food",
              description:
                "Zwraca informację na temat tego jakie jest ulubione jedzenie z odpowiedzi użytkownika.",
              parameters: {
                type: "object",
                properties: {
                  favorite_food: {
                    type: "string",
                    description: "Ulubione jedzenie osoby z pytania.",
                  },
                },
                required: ["favorite_food"],
              },
            },
          },
        ]
      : [
          {
            type: "function",
            function: {
              name: "get_place_of_residence",
              description:
                "Zwraca informację na temat miejsca zamieszkania osoby z odpowiedzi użytkownika.",
              parameters: {
                type: "object",
                properties: {
                  place_of_residence: {
                    type: "string",
                    description: "Miejsce zamieszkania użytkownika.",
                  },
                },
                required: ["place_of_residence"],
              },
            },
          },
        ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages,
    tools,
    tool_choice: "auto",
  });

  const responseMessage = response.choices[0].message;

  const toolCalls = responseMessage.tool_calls;

  let answer: string;

  if (toolCalls) {
    for (const toolCall of toolCalls) {
      const { name: functionName } = toolCall.function;

      if (
        functionName === "get_place_of_residence" ||
        functionName === "get_favorite_food"
      ) {
        console.log(toolCall);

        const { place_of_residence, favorite_food } = JSON.parse(
          toolCall.function.arguments
        );

        console.log({ place_of_residence, favorite_food });

        if (propertyName === "food") {
          answer = favorite_food;
        } else {
          answer = place_of_residence;
        }
      }
    }
  }

  return answer!;
}

export const PEOPLE = "https://zadania.aidevs.pl/data/people.json";
const peopleResponse = await fetch(PEOPLE);
const peopleData: any[] = await peopleResponse.json();

(async () => {
  const { token } = await apiClient.authorize("people");
  const taskResponse = await apiClient.getTask(token);

  console.log(taskResponse);

  const { question } = taskResponse;

  const parsedPerson = await parsePerson(question);

  console.log(parsedPerson);

  const personData = peopleData.find(
    (person) =>
      person.imie === parsedPerson.formalName &&
      person.nazwisko === parsedPerson.surname
  );

  console.log(personData);

  let answer = "";

  if (parsedPerson.property === "color") {
    answer = personData.ulubiony_kolor;
  } else {
    answer = await getSophisticatedAnswer(
      personData.o_mnie,
      parsedPerson.property
    );
  }

  console.log({ answer });

  const answerResponse = await apiClient.answer(token, answer);

  console.log(answerResponse);
})();
