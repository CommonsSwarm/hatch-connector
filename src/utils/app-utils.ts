import { BigNumber } from 'ethers'
import HatchConfig from '../models/HatchConfig'
import {
  STATE_PENDING,
  STATE_CLOSED,
  STATE_GOAL_REACHED,
  STATE_FUNDING,
  STATE_REFUNDING,
} from '../hatch-states'
export const IMPACT_HOURS_APP = 'impact-hours-beta'
export const HATCH_APP = 'marketplace-hatch'
export const HATCH_ORACLE_APP = 'hatch-oracle'

export function calculateHatchState(
  hatch: HatchConfig,
  subgraphState: string
): string {
  const now = Date.now() / 1000

  if (hatch.openDate === 0 || hatch.openDate > now) {
    return STATE_PENDING
  }

  if (hatch.totalRaised >= hatch.maxGoal) {
    if (subgraphState === STATE_CLOSED) {
      return STATE_CLOSED
    } else {
      return STATE_GOAL_REACHED
    }
  }

  if (now - hatch.openDate < hatch.period) {
    return STATE_FUNDING
  } else if (BigNumber.from(hatch.totalRaised).gte(hatch.minGoal)) {
    if (subgraphState === STATE_CLOSED) {
      return STATE_CLOSED
    } else {
      return STATE_GOAL_REACHED
    }
  } else {
    return STATE_REFUNDING
  }
}
