import * as dotenv from "dotenv";
dotenv.config();

import apiClient from "./api";
import gptClient from "./gpt";
import httpClient from "./http";

export { apiClient, gptClient, httpClient };
