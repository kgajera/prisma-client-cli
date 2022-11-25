import { expect, test } from "vitest";
import { lowerCaseFirstLetter } from "../lowerCaseFirstLetter";

test("lowerCaseFirstLetter", async () => {
  expect(lowerCaseFirstLetter("User")).toEqual("user");
  expect(lowerCaseFirstLetter("user")).toEqual("user");
  expect(lowerCaseFirstLetter("UserProfile")).toEqual("userProfile");
});
