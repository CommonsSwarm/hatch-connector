import { Address, SubscriptionHandler } from '@aragon/connect-core'
import { SubscriptionCallback, IPresaleConnector } from '../types'
import Config from './Config'
import Contribution from './Contribution'

export default class Presale {
  #appAddress: Address
  #connector: IPresaleConnector

  constructor(connector: IPresaleConnector, address: Address) {
    this.#connector = connector
    this.#appAddress = address
  }

  async disconnect(): Promise<void> {
    this.#connector.disconnect()
  }

  onConfig(callback: SubscriptionCallback<Config>): SubscriptionHandler {
    return this.#connector.onConfig(this.#appAddress, callback)
  }

  contributions({
    contributor = '',
    first = 1000,
    skip = 0,
    orderBy = 'value',
    orderDirection = 'desc',
  } = {}): Promise<Contribution[]> {
    return this.#connector.contributions(
      this.#appAddress,
      contributor,
      first,
      skip,
      orderBy,
      orderDirection
    )
  }

  onContributions(
    {
      contributor = '',
      first = 1000,
      skip = 0,
      orderBy = 'value',
      orderDirection = 'desc',
    } = {},
    callback: SubscriptionCallback<Contribution[]>
  ): SubscriptionHandler {
    return this.#connector.onContributions(
      this.#appAddress,
      contributor,
      first,
      skip,
      orderBy,
      orderDirection,
      callback
    )
  }
}
