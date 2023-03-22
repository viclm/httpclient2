import {
  HttpClientAdapter,
  HttpRequestConfig,
  HttpResponse,
  HttpInterceptor,
  HttpHandler,
  HttpOperator as Operator
} from "./interfaces";

class Promisable {
  constructor(private request: () => Promise<HttpResponse>) {}

  toPromise(): Promise<HttpResponse>;
  toPromise<A>(op1: Operator<HttpResponse, A>): Promise<A>;
  toPromise<A, B>(
    op1: Operator<HttpResponse, A>,
    op2: Operator<A, B>
  ): Promise<B>;
  toPromise<A, B, C>(
    op1: Operator<unknown, A>,
    op2: Operator<A, B>,
    op3: Operator<B, C>
  ): Promise<C>;
  toPromise<A, B, C>(
    op1: Operator<HttpResponse, A>,
    op2: Operator<A, B>,
    op3: Operator<B, C>,
    ...ops: Operator<any, any>[]
  ): Promise<unknown>;
  toPromise(...operators: Operator<any, any>[]): Promise<any> {
    return [() => this.request.call(null), ...operators].reduce(
      (promise, operator) => operator(promise),
      Promise.resolve()
    );
  }
}

export class HttpClient {
  _handler: HttpHandler;

  constructor(handler: HttpHandler) {
    this._handler = handler;
  }

  request(config: HttpRequestConfig) {
    return new Promisable(() => this._handler.handle(config));
  }

  get(url: string, config?: HttpRequestConfig) {
    return new Promisable(() =>
      this._handler.handle(
        Object.assign(config || {}, {
          method: "get",
          url
        })
      )
    );
  }

  post(url: string, data?: any, config?: HttpRequestConfig) {
    return new Promisable(() =>
      this._handler.handle(
        Object.assign(config || {}, {
          method: "post",
          url,
          data
        })
      )
    );
  }

  postForm(url: string, data?: any, config?: HttpRequestConfig) {
    return new Promisable(() =>
      this._handler.handle(
        Object.assign(config || {}, {
          method: "post",
          headers: {
            "Content-Type": "multipart/form-data"
          },
          url,
          data
        })
      )
    );
  }
}
