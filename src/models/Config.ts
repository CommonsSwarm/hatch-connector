import { ConfigData, IPresaleConnector } from '../types'

export default class Config {
  #connector: IPresaleConnector

  readonly id: string

  constructor(data: ConfigData, connector: IPresaleConnector) {
    this.#connector = connector

    this.id = data.id
  }
}
