import "./styles.css";
import { useState, useEffect } from "react";
import {
  HttpClient,
  HttpResponse,
  HttpJSONObject,
  HttpInterceptor,
  HttpOperator,
  transform,
} from "./httpclient";
import { Player } from "./schemes/player";

class myInterceptor implements HttpInterceptor {
  intercept: HttpInterceptor["intercept"] = (config, handler) =>
    handler.handle(config);
}

function myOperator1(): HttpOperator<HttpResponse, HttpJSONObject> {
  return async (promise) => (await promise).data.docs;
}

const httpClient = new HttpClient([new myInterceptor()]);

export default function App() {
  const [playerList, setPlayerList] = useState<Player[]>();

  useEffect(() => {
    httpClient
      .get("https://ratings-api.ea.com/v2/entities/fifa-23")
      .toPromise(myOperator1(), transform<Player[]>(Player))
      .then((r) => {
        setPlayerList(r);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const renderList = () => (
    <table>
      <tbody>
        {playerList?.map((player) => (
          <tr key={player.primaryKey}>
            <td>{player.fullNameForSearch}</td>
            <td>{player.preferredfootlabel}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return <div className="App">{renderList()}</div>;
}
