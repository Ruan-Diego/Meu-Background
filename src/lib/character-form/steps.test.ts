import { describe, expect, it } from "vitest";

import { STEP_COUNT, clampStepIndex } from "@/lib/character-form/steps";

describe("clampStepIndex", () => {
  it("should return 0 for negative indices", () => {
    expect(clampStepIndex(-1)).toBe(0);
    expect(clampStepIndex(-100)).toBe(0);
  });

  it("should return 0 for NaN", () => {
    expect(clampStepIndex(Number.NaN)).toBe(0);
  });

  it("should return index when in range", () => {
    expect(clampStepIndex(0)).toBe(0);
    expect(clampStepIndex(STEP_COUNT - 1)).toBe(STEP_COUNT - 1);
    expect(clampStepIndex(3)).toBe(3);
  });

  it("should clamp to last step when index overflows", () => {
    expect(clampStepIndex(STEP_COUNT)).toBe(STEP_COUNT - 1);
    expect(clampStepIndex(999)).toBe(STEP_COUNT - 1);
  });
});
