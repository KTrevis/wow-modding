import type { Spec } from "./spec-list";

export function buildSpecPayload(specs: Spec[]): string {
  return specs.map((spec) => `${spec.id}|${spec.name}`).join(";");
}
