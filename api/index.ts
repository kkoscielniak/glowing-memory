import * as dotenv from "dotenv";
dotenv.config();

import apiClient from "./api";
import gptClient from "./gpt";

export { apiClient, gptClient };
