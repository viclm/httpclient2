import { validateClass } from "./validate";
import { Expose, Type } from "./decorators";

const CONSTRAINT_TYPE_ERROR = "$value is not a ";
const CONSTRAINT_REQUIRED_ERROR = "$property is required";

describe("validateClass", () => {
  it("validate: validate a json object against a class", () => {
    class Cat {
      @Expose()
      name: string;
    }

    const tom = {
      name: "tom",
    };

    expect(validateClass(tom, Cat).length).toBe(0);
  });

  // test("type must be matched", () => {
  //   class Cat {
  //     @Expose()
  //     age: number;
  //   }

  //   const tom = {
  //     age: "3"
  //   };

  //   expect(validateClass(tom, Cat).length).toBe(1);
  //   expect(validateClass(tom, Cat)).toContainEqual({
  //     constraints: { type: CONSTRAINT_TYPE_ERROR + "Number" },
  //     property: "age",
  //     value: "3"
  //   });
  // });

  // test("validate: exposed property is required", () => {
  //   class Cat {
  //     @Expose()
  //     name: string;

  //     @Expose()
  //     age: number;
  //   }

  //   const tom = {
  //     name: "tom"
  //   };

  //   expect(validateClass(tom, Cat).length).toBe(1);
  //   expect(validateClass(tom, Cat)).toContainEqual({
  //     constraints: { required: CONSTRAINT_REQUIRED_ERROR },
  //     property: "age",
  //     value: undefined
  //   });
  // });

  // test("validate: complex type", () => {
  //   class Mouse {
  //     @Expose()
  //     name: string;
  //   }

  //   class Cat {
  //     @Expose()
  //     name: string;

  //     @Expose()
  //     partner: Mouse;
  //   }

  //   const tom = {
  //     name: "tom",
  //     partner: {
  //       name: "jerry"
  //     }
  //   };

  //   const butch = {
  //     name: "butch",
  //     partner: {}
  //   };

  //   expect(validateClass(tom, Cat).length).toBe(0);
  //   expect(validateClass(butch, Cat).length).toBe(1);
  //   expect(validateClass(butch, Cat)).toContainEqual({
  //     constraints: { required: CONSTRAINT_REQUIRED_ERROR },
  //     property: "partner.name",
  //     value: undefined
  //   });
  // });

  // test("validate: primary array", () => {
  //   class Cat {
  //     @Expose()
  //     name: string;

  //     @Expose()
  //     @Type(() => String)
  //     enemies: string[];
  //   }

  //   const tom = {
  //     name: "tom",
  //     enemies: ["spike", "tyke"]
  //   };

  //   const butch = {
  //     name: "butch",
  //     enemies: [
  //       {
  //         name: "jerry"
  //       }
  //     ]
  //   };

  //   expect(validateClass(tom, Cat).length).toBe(0);
  //   expect(validateClass(butch, Cat).length).toBe(1);
  //   expect(validateClass(butch, Cat)).toContainEqual({
  //     constraints: {
  //       type: CONSTRAINT_TYPE_ERROR + "String"
  //     },
  //     property: "enemies[0]",
  //     value: {
  //       name: "jerry"
  //     }
  //   });
  // });

  // test("validate: complex array", () => {
  //   class Cat {
  //     @Expose()
  //     name: string;

  //     @Expose()
  //     @Type(() => Cat)
  //     similar: Cat[];
  //   }

  //   const tom = {
  //     name: "tom",
  //     similar: [
  //       {
  //         name: "butch",
  //         similar: [
  //           {
  //             name: "lightning",
  //             similar: [
  //               {
  //                 name: "topsy"
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   };

  //   expect(validateClass(tom, Cat).length).toBe(1);
  //   expect(validateClass(tom, Cat)).toContainEqual({
  //     constraints: {
  //       required: CONSTRAINT_REQUIRED_ERROR
  //     },
  //     property: "similar[0].similar[0].similar[0].similar",
  //     value: undefined
  //   });
  // });
});
