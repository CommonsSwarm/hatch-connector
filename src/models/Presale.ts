import { Address, SubscriptionHandler } from '@aragon/connect-core'
import { SubscriptionCallback, IPresaleConnector } from '../types'
import Config from './Config'

export default class Presale {
  #address: Address
  #connector: IPresaleConnector

  constructor(connector: IPresaleConnector, address: Address) {
    this.#connector = connector
    this.#address = address
  }

  async disconnect(): Promise<void> {
    this.#connector.disconnect()
  }

  onConfig(callback: SubscriptionCallback<Config>): SubscriptionHandler {
    return this.#connector.onConfig(this.#address, callback)
  }
}
