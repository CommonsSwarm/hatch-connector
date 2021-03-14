import { ContributorData } from '../types'

class Contributor {
  readonly id: string
  readonly account: string
  readonly totalAmount: string
  readonly totalValue: string

  constructor(data: ContributorData) {
    this.id = data.id
    this.account = data.account
    this.totalAmount = data.totalAmount
    this.totalValue = data.totalValue
  }
}

export default Contributor
