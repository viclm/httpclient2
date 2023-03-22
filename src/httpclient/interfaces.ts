import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export { AxiosInstance };

export interface HttpClientAdapter {
  request: (config: HttpRequestConfig) => Promise<HttpResponse>;
  get: (url: string, config?: HttpRequestConfig) => Promise<HttpResponse>;
  post: (url: string, config?: HttpRequestConfig) => Promise<HttpResponse>;
  postForm: (url: string, config?: HttpRequestConfig) => Promise<HttpResponse>;
}

export interface HttpRequestConfig extends AxiosRequestConfig {}
export interface HttpResponse extends AxiosResponse {}

export type HttpJSONObject = Record<string, any> | Array<Record<string, any>>;

export interface HttpInterceptor {
  intercept(
    config: HttpRequestConfig,
    next: HttpHandler
  ): Promise<HttpResponse>;
}

export abstract class HttpHandler {
  abstract handle(config: HttpRequestConfig): Promise<HttpResponse>;
}

export interface HttpOperator<T, R> {
  (source: Promise<T>): Promise<R>;
}
