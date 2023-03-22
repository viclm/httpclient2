import { ClassConstructor, plainToInstance } from "class-transformer";
import { HttpOperator, HttpJSONObject } from "../../interfaces";
import { validateClass } from "./validate";

class ValidateClassError extends Error {
  errors;
  constructor(message: string, errors: any[]) {
    super(message);
    this.errors = errors;
  }
}

export const transform = function transform<T>(
  Class: ClassConstructor<any>,
  options?: {
    validate?: boolean;
    enableImplicitConversion?: boolean;
  }
): HttpOperator<HttpJSONObject, T> {
  options = Object.assign(
    {
      validate: true,
      validateTolerance: {
        Array: () => []
      },
      enableImplicitConversion: false
    },
    options
  );

  return async (promise): Promise<T> => {
    const json = await promise;

    if (options?.validate) {
      const errors = validateClass(json, Class);
      if (errors.length) {
        throw new ValidateClassError("Validate fails", errors);
      }
    }

    return plainToInstance(Class, json, {
      excludeExtraneousValues: true,
      enableImplicitConversion: options!.enableImplicitConversion
    });
  };
};
