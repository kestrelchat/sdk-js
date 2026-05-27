export interface KestrelClientOptions {
  baseUrl?: string;
}

export class KestrelClient {
  private baseUrl: string;

  constructor(options: KestrelClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? 'https://kestrel.chat/api';
  }

  public async ping(): Promise<string> {
    return 'pong';
  }

  public getApiUrl(): string {
    return this.baseUrl;
  }
}
