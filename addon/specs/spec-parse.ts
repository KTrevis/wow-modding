import type { ClientSpec } from "../../shared/specs/spec.types";

export function parseSpecs(payload: string): ClientSpec[] {
  if (payload === "") {
    return [];
  }

  const specs: ClientSpec[] = [];

  for (const entry of payload.split(";")) {
    const split = entry.split("|");
    const id = split[0];
    const name = split[1];

    if (id !== "" && name !== undefined && name !== "") {
      specs.push({ id, name });
    }
  }

  return specs;
}
