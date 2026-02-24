export function numberify(value: unknown): number {
  if (value === undefined || value === null) {
    throw new Error("Value is undefined or null");
  }

  if (typeof value === "number") {
    if (Number.isNaN(value)) {
      throw new Error("Value is NaN");
    }
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (trimmed === "") {
      throw new Error("Empty string cannot be converted to number");
    }

    const num = Number(trimmed);

    if (!Number.isInteger(num)) {
      throw new Error(`Value "${value}" is not a valid integer`);
    }

    return num;
  }

  throw new Error(`Unsupported type: ${typeof value}`);
}
