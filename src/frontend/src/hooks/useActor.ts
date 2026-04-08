// Connects to the real ICP backend canister using platform infrastructure.
// Types are re-exported here so useQueries.ts and other files can import them.

import { useActor as usePlatformActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

// Re-export canonical types from the generated bindings
export type {
  JobRecord,
  JobWithId as JobWithIdRaw,
  BookingRecord,
  BookingWithId,
} from "../backend";

/**
 * Returns the real backend actor connected to the ICP canister.
 * The actor is created once via the platform hook (memoized internally)
 * and automatically recreated when the user's Internet Identity changes.
 */
export function useActor() {
  return usePlatformActor(createActor);
}
