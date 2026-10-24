import assert from "node:assert/strict";
import test from "node:test";
import { DISTRICTS, PLANS } from "../data/network.ts";
import {
  buildDesk,
  busiestGatewayTonnes,
  defaultPhysical,
  shockSeed,
  simulate,
} from "./planning.ts";

const TOLERANCE = 0.05;

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

test("embedded district demand and divisional-flow totals agree within rounding", () => {
  assert.equal(DISTRICTS.length, 64);
  assert.deepEqual(Object.keys(PLANS).sort(), [
    "north",
    "northFlex",
    "south",
    "southFlex",
    "stochastic",
    "stochasticFlex",
  ]);

  for (const [planId, plan] of Object.entries(PLANS)) {
    assert.equal(Object.keys(plan.districts).length, DISTRICTS.length, `${planId}: one row per district`);
    for (const [district, row] of Object.entries(plan.districts)) {
      const flowTonnes = sum(Object.values(row.from));
      assert.ok(
        Math.abs(flowTonnes - row.demand) <= TOLERANCE,
        `${planId}/${district}: demand ${row.demand} differs from DC flows ${flowTonnes}`,
      );
    }
  }
});

test("desk calculations conserve district physical tonnes and gateway import tonnes", () => {
  for (const scenario of ["north", "south", "stochastic"] as const) {
    for (const network of ["base", "flex"] as const) {
      for (const cyclone of [false, true]) {
        const desk = buildDesk({
          scenario,
          network,
          cyclone,
          physicalShare: defaultPhysical(scenario, cyclone),
          stapleIndex: 100,
          clusterSize: 5000,
          zoning: true,
        });

        assert.ok(Number.isFinite(desk.affected) && desk.affected >= 0);
        assert.ok(Math.abs(sum(desk.districts.map((district) => district.physicalTonnes)) - desk.physicalTonnes) < TOLERANCE);
        assert.ok(Math.abs(sum(desk.gateways.map((gateway) => gateway.tonnes)) - desk.importTonnes) < TOLERANCE);
        assert.equal(desk.clusters, sum(desk.active.map((district) => district.clusters)));
      }
    }
  }
});

test("Monte Carlo service-level simulation is reproducible and accounts for all requested runs", () => {
  const desk = buildDesk({
    scenario: "north",
    network: "base",
    cyclone: false,
    physicalShare: 0.25,
    stapleIndex: 100,
    clusterSize: 5000,
    zoning: true,
  });
  const busy = busiestGatewayTonnes(desk);
  const input = {
    importThroughBusiest: busy.tonnes,
    otherTonnes: Math.max(0, desk.physicalTonnes - busy.tonnes),
    capacity: 1,
    safety: 0.08,
    cv: 0.15,
    nodeStress: 0,
    runs: 10000,
    seed: shockSeed("north", false),
  };

  const first = simulate(input);
  const second = simulate(input);
  assert.ok(first && second);
  assert.deepEqual(first, second);
  assert.equal(sum(first.histogram.map((bin) => bin.count)), 10000);
  assert.ok(first.fillRate >= 0 && first.fillRate <= 1);
  assert.ok(first.shareAt95 >= 0 && first.shareAt95 <= 1);
  assert.equal(first.histogram[0].to, 73);
  assert.equal(first.histogram.at(-1)?.to, 100);
});
