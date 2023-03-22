import { HttpResponse, HttpOperator } from "../../interfaces";
import { httpClient } from "../../index";

export const retry = function retry(
  count = 3
): HttpOperator<HttpResponse, HttpResponse> {
  return ((count) => {
    return async (promise) => {
      try {
        return await promise;
      } catch (err) {
        if (count === 0) {
          throw err;
        }
        count--;
        return httpClient.request(err.config).toPromise();
      }
    };
  })(count);
};
