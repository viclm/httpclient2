import { ClassConstructor } from "class-transformer";
import { HttpOperator, HttpJSONObject } from "../../interfaces";

interface TypeError {
  constraints: {
    required?: string;
    type?: string;
  };
  property: string;
  value: any;
}

export const validateClass = function validateClass(
  json: HttpJSONObject,
  Class: ClassConstructor<any>
): TypeError[] {
  if (!json || !Class) {
    throw new Error("Invalid Class argument for validateClass");
  }
  if (Array.isArray(json)) {
    return Array.prototype.concat.apply(
      [],
      json.map((json, index) => {
        const errors = validateClass(json, Class);
        errors.forEach((error) => {
          error.property = `[${index}].${error.property}`;
        });
        return errors;
      })
    );
  }
  const properties = Reflect.getMetadata("custom:properties", Class.prototype);
  return !properties
    ? []
    : properties.reduce((errors: TypeError[], property: string) => {
        const Type = Reflect.getMetadata(
          "design:type",
          Class.prototype,
          property
        );
        const value = json[property];
        console.log(
          property,
          Type,
          value,
          Reflect.getMetadataKeys(Class.prototype, property)
        );
        if (value == null) {
          const isTransform = Reflect.getMetadata(
            "custom:transform",
            Class.prototype,
            property
          );
          if (isTransform) {
            const transformDeps = Reflect.getMetadata(
              "custom:transform-deps",
              Class.prototype,
              property
            );
            transformDeps.reduce((errors: TypeError[], property: string) => {
              if (json[property] == null) {
                errors.push({
                  constraints: { required: `$property is required` },
                  property,
                  value: json[property],
                });
              }
              return errors;
            }, errors);
          } else {
            errors.push({
              constraints: { required: `$property is required` },
              property,
              value,
            });
          }
        } else if (Type === Boolean || Type === Number || Type === String) {
          if (typeof value !== Type.name.toLowerCase()) {
            errors.push({
              constraints: { type: `$value is not a ${Type.name}` },
              property,
              value,
            });
          }
        } else if (Type === Array) {
          const ArrayType = Reflect.getMetadata(
            "custom:array-type",
            Class.prototype,
            property
          );
          if (
            ArrayType === Boolean ||
            ArrayType === Number ||
            ArrayType === String
          ) {
            const type = ArrayType.name.toLowerCase();
            value.reduce(
              (errors: TypeError[], value: unknown, index: number) => {
                if (typeof value !== type) {
                  errors.push({
                    constraints: { type: `$value is not a ${ArrayType.name}` },
                    property: `${property}[${index}]`,
                    value,
                  });
                }
                return errors;
              },
              errors
            );
          } else if (
            Object.prototype.toString.call(ArrayType) === "[object Function]"
          ) {
            validateClass(value, ArrayType).reduce((errors, error, index) => {
              error.property = `${property}.${error.property}`;
              errors.push(error);
              return errors;
            }, errors);
          }
        } else if (
          Object.prototype.toString.call(Type) === "[object Function]"
        ) {
          validateClass(value, Type).reduce((errors, error) => {
            error.property = `${property}.${error.property}`;
            errors.push(error);
            return errors;
          }, errors);
        }
        return errors;
      }, []);
};
