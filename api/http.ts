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

  async post(url: string, body: any): Promise<unknown> {
    const { data, ok, originalError } = await this.api.post<unknown>(url, {
      body,
    });

    if (ok) {
      return data!;
    }

    throw new Error(originalError.message);
  }

  async postFormUrlencoded(url: string, payload: any): Promise<unknown> {
    let formUrlencoded;
    if (typeof payload !== "string") {
      let formBody: any[] = [];
      for (let property in payload) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(payload[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }

      formUrlencoded = formBody.join("&");
    }

    console.log(payload);

    const { data, ok, originalError } = await this.api.post<unknown>(
      url,
      formUrlencoded || payload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (ok) {
      return data!;
    }

    throw new Error(originalError.message);
  }

  async postText(url: string, payload: string): Promise<unknown> {
    const { data, ok, originalError } = await this.api.post<unknown>(
      url,
      payload,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );

    console.log(originalError);

    if (ok) {
      return data!;
    }

    throw new Error(originalError.message);
  }
}

export default new HttpClient();
