import { SubscriptionHandler } from '@aragon/connect-core'
import Config from './models/Config'
import Contribution from './models/Contribution'

/**
 * Pending
 * Funding
 * Refunding
 * GoalReached
 * Closed
 */
export const PRESALE_STATES = [0, 1, 2, 3, 4]

export type SubscriptionCallback<T> = (error: Error | null, data?: T) => void
export type Address = string

export interface TokenData {
  id: string
  name: string
  symbol: string
  decimals: number
}

export interface ConfigData {
  id: string
  token: TokenData
  reserve: string
  beneficiary: string
  contributionToken: TokenData
  goal: number
  period: number
  exchangeRate: number
  vestingCliffPeriod: number
  vestingCompletePeriod: number
  supplyOfferedPct: number
  fundingForBeneficiaryPct: number
  openDate: number
  vestingCliffDate: number
  vestingCompleteDate: number
  totalRaised: number
  state: string
}

export interface ContributionData {
  id: string
  contributor: string
  value: number
  amount: number
  vestedPurchaseId: number
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IPresaleConnector {
  disconnect(): Promise<void>
  onConfig(
    appAddress: string,
    callback: SubscriptionCallback<Config>
  ): SubscriptionHandler
  contributions(
    appAddress: string,
    first: number,
    skip: number
  ): Promise<Contribution[]>
  onContributions(
    appAddress: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Contribution[]>
  ): SubscriptionHandler
}
