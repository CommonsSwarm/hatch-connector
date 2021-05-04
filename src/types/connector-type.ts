import { SubscriptionHandler } from '@1hive/connect-core'
import ContractCache from '../models/helpers/ContractCache'
import Contribution from '../models/Contribution'
import Contributor from '../models/Contributor'
import GeneralConfig from '../models/GeneralConfig'

export type SubscriptionCallback<T> = (error: Error | null, data?: T) => void

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IHatchConnector {
  disconnect(): Promise<void>
  generalConfig(
    orgAddress: string,
    contractCache: ContractCache
  ): Promise<GeneralConfig>
  onGeneralConfig(
    orgAddress: string,
    callback: SubscriptionCallback<GeneralConfig>,
    contractCache: ContractCache
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
