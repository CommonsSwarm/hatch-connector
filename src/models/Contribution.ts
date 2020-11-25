import { ContributionData, IPresaleConnector } from '../types'

export default class Contribution {
  #connector: IPresaleConnector

  readonly id: string
  readonly contributor: string
  readonly value: number
  readonly amount: number
  readonly vestedPurchaseId: number

  constructor(data: ContributionData, connector: IPresaleConnector) {
    this.#connector = connector

    this.id = data.id
    this.contributor = data.contributor
    this.value = data.value
    this.amount = data.amount
    this.vestedPurchaseId = data.vestedPurchaseId
  }
}
