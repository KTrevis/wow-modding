import type { ClientSpec } from "../../shared/specs/spec.types";
import type { Spec } from "./spec-list";

export function buildSpecPayload(specs: Spec[]): string {
  const clientSpecs: ClientSpec[] = specs.map((spec) => ({
    id: spec.id,
    name: spec.name,
  }));

  return clientSpecs.map((spec) => `${spec.id}|${spec.name}`).join(";");
}
