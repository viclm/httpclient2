import { Expose, Transform } from "../httpclient/operators/transform";

export class Player {
  @Expose()
  primaryKey: number;

  @Expose()
  fullNameForSearch: string;

  @Expose()
  @Transform(({ obj }) => ["左右脚", "右脚", "左脚"][obj.preferredfoot])
  preferredfootlabel: string;
}
