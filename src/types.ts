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
  goal: string
  period: number
  exchangeRate: string
  vestingCliffPeriod: number
  vestingCompletePeriod: number
  supplyOfferedPct: string
  fundingForBeneficiaryPct: string
  openDate: string
  vestingCliffDate: number
  vestingCompleteDate: number
  totalRaised: string
  state: string
}

export interface ContributionData {
  id: string
  contributor: string
  value: string
  amount: string
  vestedPurchaseId: string
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
