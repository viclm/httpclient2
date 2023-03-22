import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import {
  HttpRequestConfig,
  HttpResponse,
  HttpInterceptor,
  HttpHandler
} from "./interfaces";

class Handler extends HttpHandler {
  handle: HttpHandler["handle"] = () => {
    return {} as Promise<HttpResponse>;
  };
}

export class AxiosHandler extends HttpHandler {
  axiosInstance: AxiosInstance;

  constructor(readonly interceptors: HttpInterceptor[]) {
    super();
    this.axiosInstance = axios.create();
  }

  handle(config: HttpRequestConfig): Promise<HttpResponse> {
    const bridges: [
      (res: HttpResponse) => void,
      Promise<HttpResponse> | null
    ][] = [];

    this.interceptors.forEach((interceptor) => {
      const promise = new Promise<HttpResponse>((resolve, reject) => {
        const bridge: [
          (res: HttpResponse) => void,
          Promise<HttpResponse> | null
        ] = [resolve, null];
        bridges.push(bridge);

        let resolvedConfig: HttpRequestConfig;

        const handler = new Handler();
        handler.handle = (config) => {
          resolvedConfig = config;
          return promise;
        };

        this.axiosInstance.interceptors.request.use(
          (config) => {
            const res = interceptor.intercept(config, handler);
            if (!(res instanceof Promise)) {
              throw new Error(
                "HttpInterceptor.intercept must return a promise"
              );
            }
            bridge[1] = res;
            return (resolvedConfig || config) as InternalAxiosRequestConfig;
          },
          (error) => Promise.reject(error)
        );
      });

      bridges.reverse();
      bridges.forEach((bridge) => {
        this.axiosInstance.interceptors.response.use(
          (res) => {
            bridge[0](res);
            return bridge[1]!;
          },
          (error) => Promise.reject(error)
        );
      });
    });

    return this.axiosInstance.request(config);
  }
}
