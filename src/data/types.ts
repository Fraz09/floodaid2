/* Planning figures extracted from the FloodAid scenario workbooks.
   District coordinates are kilometres from Dhaka. Aid tonnes and divisional
   flows are the MILP solutions (base network and flexible network). */
export type DivisionName =
  | "Dhaka"
  | "Chattogram"
  | "Mymensingh"
  | "Sylhet"
  | "Rangpur"
  | "Rajshahi"
  | "Khulna"
  | "Barishal"

export type PortName = "Dhaka" | "Chattogram" | "Sylhet" | "Jashore" | "Bagerhat"

export type DistrictSeed = {
  name: string
  x: number
  y: number
  population: number
  division: DivisionName
}

export type DistrictPlan = {
  demand: number
  affected: number
  from: Partial<Record<DivisionName, number>>
}

export type NetworkPlan = {
  districts: Record<string, DistrictPlan>
  ports: Record<PortName, Partial<Record<DivisionName, number>>>
}
