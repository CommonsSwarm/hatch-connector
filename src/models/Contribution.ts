import { ContributionData } from '../types'

export default class Contribution {
  readonly id: string
  readonly contributor: string
  readonly value: string
  readonly amount: string
  readonly vestedPurchaseId: string

  constructor(data: ContributionData) {
    this.id = data.id
    this.contributor = data.contributor
    this.value = data.value
    this.amount = data.amount
    this.vestedPurchaseId = data.vestedPurchaseId
  }
}
