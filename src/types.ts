import { SubscriptionHandler } from '@1hive/connect-core'
import { Contract } from '@ethersproject/contracts'
import Contribution from './models/Contribution'
import Contributor from './models/Contributor'
import GeneralConfig from './models/GeneralConfig'

export type SubscriptionCallback<T> = (error: Error | null, data?: T) => void

export interface HatchContractSettings {
  hatch: Contract
  hatchOracle: Contract
  impactHours: Contract
  token: Contract
  contributionToken: Contract
  reserveAgent: Contract
}

export interface ERC20TokenData {
  id: string
  name: string
  symbol: string
  decimals: string
}

export interface HatchOracleConfigData {
  id: string
  scoreToken: ERC20TokenData
  ratio: string
}

export interface HatchConfigData {
  id: string
  token: ERC20TokenData
  reserve: string
  beneficiary: string
  contributionToken: ERC20TokenData
  minGoal: string
  maxGoal: string
  period: string
  exchangeRate: string
  vestingCliffPeriod: string
  vestingCompletePeriod: string
  supplyOfferedPct: string
  fundingForBeneficiaryPct: string
  openDate: string
  vestingCliffDate: string
  vestingCompleteDate: string
  totalRaised: string
  state: string
  PPM: string
}

export interface GeneralConfigData {
  id: string
  hatch: HatchConfigData
  hatchOracle: HatchOracleConfigData
}

export interface ContributorData {
  id: string
  account: string
  totalAmount: string
  totalValue: string
}

export interface ContributionData {
  id: string
  contributorId: string
  value: string
  amount: string
  vestedPurchaseId: string
  createdAt: string
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IHatchConnector {
  disconnect(): Promise<void>
  generalConfig(
    orgAddress: string,
    hatchContractSettings: HatchContractSettings
  ): Promise<GeneralConfig>
  onGeneralConfig(
    orgAddress: string,
    callback: SubscriptionCallback<GeneralConfig>,
    hatchContractSettings: HatchContractSettings
  ): SubscriptionHandler
  contributors(
    appAddress: string,
    first: number,
    skip: number,
    orderBy: string,
    orderDirection: string
  ): Promise<Contributor[]>
  onContributors(
    appAddress: string,
    first: number,
    skip: number,
    orderBy: string,
    orderDirection: string,
    callback: SubscriptionCallback<Contributor[]>
  ): SubscriptionHandler
  contributor(id: string): Promise<Contributor>
  onContributor(
    id: string,
    callback: SubscriptionCallback<Contributor>
  ): SubscriptionHandler
  contributions(
    appAddress: string,
    contributor: string,
    first: number,
    skip: number,
    orderBy: string,
    orderDirection: string
  ): Promise<Contribution[]>
  onContributions(
    appAddress: string,
    contributor: string,
    first: number,
    skip: number,
    orderBy: string,
    orderDirection: string,
    callback: SubscriptionCallback<Contribution[]>
  ): SubscriptionHandler
}
