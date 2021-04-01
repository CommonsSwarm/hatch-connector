export const STATE_PENDING = 'Pending'
export const STATE_FUNDING = 'Funding'
export const STATE_REFUNDING = 'Refunding'
export const STATE_GOAL_REACHED = 'GoalReached'
export const STATE_CLOSED = 'Closed'

const states: string[] = [
  STATE_PENDING,
  STATE_FUNDING,
  STATE_REFUNDING,
  STATE_GOAL_REACHED,
  STATE_CLOSED,
]

export function getStateByKey(stateKey: number): string {
  return states[stateKey]
}
