import type { Spec } from "./spec-list";

export function buildSpecPayload(
  specs: readonly Spec[],
  activeSpecId: string | undefined,
): string {
  return specs
    .map((spec) => `${spec.id}|${spec.name}|${spec.id === activeSpecId}`)
    .join(";");
}
