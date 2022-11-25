import { expect, test } from "vitest";
import { upperCaseFirstLetter } from "../upperCaseFirstLetter";

test("upperCaseFirstLetter", async () => {
  expect(upperCaseFirstLetter("user")).toEqual("User");
  expect(upperCaseFirstLetter("User")).toEqual("User");
  expect(upperCaseFirstLetter("userProfile")).toEqual("UserProfile");
  expect(upperCaseFirstLetter("UserProfile")).toEqual("UserProfile");
});
