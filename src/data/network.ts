/* Planning figures extracted from the FloodAid scenario workbooks.
   District coordinates are kilometres from Dhaka. Aid tonnes and divisional
   flows are the MILP solutions (base network and flexible network).
   Data is split across modules for maintainability; public API is unchanged. */
import type { NetworkPlan } from "./types"
import { northPlan } from "./plan-north"
import { northFlexPlan } from "./plan-northFlex"
import { southPlan } from "./plan-south"
import { southFlexPlan } from "./plan-southFlex"
import { stochasticPlan } from "./plan-stochastic"
import { stochasticFlexPlan } from "./plan-stochasticFlex"

export type {
  DivisionName,
  PortName,
  DistrictSeed,
  DistrictPlan,
  NetworkPlan,
} from "./types"
export { DISTRICTS } from "./districts"

export const PLANS: Record<string, NetworkPlan> = {
  north: northPlan,
  northFlex: northFlexPlan,
  south: southPlan,
  southFlex: southFlexPlan,
  stochastic: stochasticPlan,
  stochasticFlex: stochasticFlexPlan,
}
