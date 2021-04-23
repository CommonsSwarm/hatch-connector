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
  const totalRaised = BigNumber.from(hatch.totalRaised)
  const maxGoal = BigNumber.from(hatch.maxGoal)
  const minGoal = BigNumber.from(hatch.minGoal)
  const openDate = Number(hatch.openDate)
  const period = Number(hatch.period)

  if (openDate === 0 || openDate > now) {
    return STATE_PENDING
  }

  if (totalRaised.gte(maxGoal)) {
    if (subgraphState === STATE_CLOSED) {
      return STATE_CLOSED
    } else {
      return STATE_GOAL_REACHED
    }
  }

  if (now - openDate < period) {
    return STATE_FUNDING
  } else if (totalRaised.gte(minGoal)) {
    if (subgraphState === STATE_CLOSED) {
      return STATE_CLOSED
    } else {
      return STATE_GOAL_REACHED
    }
  } else {
    return STATE_REFUNDING
  }
}
