import { API } from "./api_wrapper.ts";

export interface KestrelClientOptions {
  base_url: string;
}

export class KestrelClient {
  private base_url: string;
  private api: API;

  constructor(options: KestrelClientOptions) {
    this.base_url = options.base_url ?? 'https://kestrel.chat/api';
    this.api = new API(options.base_url);
  }

  public async Ping(): Promise<string> {
    return 'pong';
  }

  public GetBaseURL(): string {
    return this.base_url;
  }
}
