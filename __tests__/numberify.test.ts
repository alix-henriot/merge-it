import { numberify } from "@/utils/numberify";

describe("Numberify Unit Test Suites", () => {
  it("should throw when value is undefined", () => {
    expect(() => numberify(null)).toThrow("Value is undefined or null");
  });

  it("should return number when value is number", () => {
    expect(numberify(10)).toBe(10);
  });

  //it("should throw when value is incorrect string")
  it("should return number when value is String", () => {
    expect(numberify("10")).toBe(10);
  });
});
