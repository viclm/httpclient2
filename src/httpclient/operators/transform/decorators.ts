import {
  Expose as E,
  ExposeOptions,
  Transform as TS,
  TransformFnParams,
  TransformOptions,
  Type as T,
  TypeHelpOptions,
  TypeOptions
} from "class-transformer";

export function Transform(
  transformFn: (params: TransformFnParams) => any,
  options: TransformOptions = {}
): PropertyDecorator {
  const decorator = TS(transformFn, options);
  return function (target: any, propertyName: string | symbol): void {
    if ("Proxy" in window) {
      const transformDeps: string[] = [];
      const proxy = new Proxy(
        {},
        {
          get(target, name) {
            if (typeof name === "string") {
              transformDeps.push(name);
            }
          }
        }
      );
      try {
        transformFn({
          value: target[propertyName],
          key: propertyName as string,
          obj: proxy,
          type: 0,
          options
        });
      } catch (err) {}
      Reflect.defineMetadata(
        "custom:transform-deps",
        [transformDeps],
        target,
        propertyName
      );
    }
    Reflect.defineMetadata("custom:transform", true, target, propertyName);
    decorator(target, propertyName);
  };
}

export function Expose(
  options: ExposeOptions = {}
): PropertyDecorator & ClassDecorator {
  const decorator = E(options);
  return function (object: any, propertyName?: string | symbol): void {
    if (propertyName === undefined) {
      decorator(object);
    } else {
      const reflectedType = Reflect.getMetadata(
        "design:type",
        object,
        propertyName
      );
      console.log(reflectedType);
      if (reflectedType === Array) {
        const arrayType = Reflect.getMetadata(
          "custom:array-type",
          object,
          propertyName
        );
        if (!arrayType || !arrayType.name) {
          throw new Error(
            `$property ${propertyName.toString()} array type must be provided`
          );
        }
      }
      const properties = Reflect.getMetadata("custom:properties", object) || [];
      properties.push(propertyName);
      Reflect.defineMetadata("custom:properties", properties, object);
      decorator(object, propertyName);
    }
  };
}

export function Type(
  typeFunction?: (type?: TypeHelpOptions) => Function,
  options: TypeOptions = {}
): PropertyDecorator {
  const decorator = T(typeFunction, options);
  return function (target: any, propertyName: string | symbol): void {
    const reflectedType = Reflect.getMetadata(
      "design:type",
      target,
      propertyName
    );
    if (reflectedType === Array) {
      const arrayType = typeFunction?.();
      if (!arrayType || !arrayType.name) {
        throw new Error(
          `$property ${propertyName.toString()} array type must be provided`
        );
      }
      Reflect.defineMetadata(
        "custom:array-type",
        arrayType,
        target,
        propertyName
      );
    }
    decorator(target, propertyName);
  };
}
