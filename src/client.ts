export interface KestrelClientOptions {
  base_url?: string;
}

export class KestrelClient {
  private base_url: string;

  constructor(options: KestrelClientOptions = {}) {
    this.base_url = options.base_url ?? 'https://kestrel.chat/api';
  }

  public async ping(): Promise<string> {
    return 'pong';
  }

  public getApiUrl(): string {
    return this.base_url;
  }
}
