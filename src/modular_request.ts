export class ModularRequest {
  url: string;
  init: RequestInit;

  constructor(url: string, init?: RequestInit) {
    this.url = url;
    this.init = init ?? {};
    this.init.headers = new Array<[string, string]>();
  }

  SetHeader(key: string, value: string) {
    this.init.headers = {
      ...this.init.headers,
      ...Object.fromEntries([[key, value]])
    }
    return this;
  }

  ContentType(content_type: string) {
    this.SetHeader('content-type', content_type);
    return this;
  }

  get ApplicationJson() {
    this.ContentType('application/json');
    return this;
  }

  Method(method: string) {
    this.init.method = method;
    return this;
  }

  get POST() {
    this.Method('POST');
    return this;
  }

  get GET() {
    this.Method('GET');
    return this;
  }

  get DELETE() {
    this.Method('DELETE');
    return this;
  }

  BearerAuth(auth_token: string) {
    this.SetHeader('authorization', `Bearer ${auth_token}`);
    return this;
  }

  Body(body: unknown) {
    this.init.body = JSON.stringify(body);
    return this;
  }
}