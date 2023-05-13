import { create, ApisauceInstance } from "apisauce";

class HttpClient {
  private readonly api: ApisauceInstance;

  constructor() {
    this.api = create({
      baseURL: "",
      headers: {
        "User-Agent": "Chrome",
      },
      timeout: 30000,
    });
  }

  async get(url: string): Promise<unknown> {
    const { data, ok, originalError } = await this.api.get<unknown>(url);

    if (ok) {
      return data!;
    }

    throw new Error(originalError.message);
  }
}

export default new HttpClient();
