import { HttpClient } from "./httpclient";
import { HttpHandler } from "./interfaces";

const handleFn = jest.fn();

class TestHandler extends HttpHandler {
  handle = handleFn;
}

const httpClient = new HttpClient(new TestHandler());

describe("httpclient", () => {
  it("a universal httpclient", async () => {
    const users = [{ name: "jack" }];
    handleFn.mockResolvedValue({ data: users });
    const res = await httpClient.get("/users").toPromise();
    expect(res.data).toEqual([{ name: "jack" }]);
  });

  test("request fails", async () => {
    handleFn.mockRejectedValueOnce("error");
    const promise = httpClient.get("/users").toPromise();
    await expect(promise).rejects.toEqual("error");
  });
});
