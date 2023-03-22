import { HttpInterceptor } from "../../interfaces";

const Cache = {};

export class CacheInterceptor implements HttpInterceptor {
  intercept: HttpInterceptor["intercept"] = (config, handler) => {
    return handler.handle(config).then();
  };
}
