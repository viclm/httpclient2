import { HttpClient } from "./httpclient";
import { AxiosHandler } from "./axios.handler";

export const httpClient = new HttpClient(new AxiosHandler());

export * from "./operators";
export * from "./interfaces";
export { HttpClient };
