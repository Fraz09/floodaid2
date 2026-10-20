/** Connector readiness status helpers. */
export type ReadinessState = "unknown" | "ready" | "blocked" | "error";

export function isReady(state: ReadinessState): boolean {
  return state === "ready";
}
