import { ContributionData } from '../types'

class Contribution {
  readonly id: string
  readonly contributorId: string
  readonly value: string
  readonly amount: string
  readonly vestedPurchaseId: string
  readonly createdAt: string

  constructor(data: ContributionData) {
    this.id = data.id
    this.contributorId = data.contributorId
    this.value = data.value
    this.amount = data.amount
    this.vestedPurchaseId = data.vestedPurchaseId
    this.createdAt = data.createdAt
  }
}

export default Contribution
