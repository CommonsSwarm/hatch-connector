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

  contributions({ first = 1000, skip = 0 } = {}): Promise<Contribution[]> {
    return this.#connector.contributions(this.#appAddress, first, skip)
  }

  onContributions(
    { first = 1000, skip = 0 } = {},
    callback: SubscriptionCallback<Contribution[]>
  ): SubscriptionHandler {
    return this.#connector.onContributions(
      this.#appAddress,
      first,
      skip,
      callback
    )
  }
}
