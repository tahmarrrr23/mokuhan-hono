import { faker } from "@faker-js/faker";

export function randomNullable<T>(value: T): T | null {
  return faker.datatype.boolean() ? value : null;
}
