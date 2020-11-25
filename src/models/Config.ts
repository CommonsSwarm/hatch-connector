import { ConfigData } from '../types'
import Token from './Token'

export default class Config {
  readonly id: string
  readonly token: Token
  readonly reserve: string
  readonly beneficiary: string
  readonly contributionToken: Token
  readonly goal: number
  readonly period: number
  readonly exchangeRate: number
  readonly vestingCliffPeriod: number
  readonly vestingCompletePeriod: number
  readonly supplyOfferedPct: number
  readonly fundingForBeneficiaryPct: number
  readonly openDate: number
  readonly vestingCliffDate: number
  readonly vestingCompleteDate: number
  readonly totalRaised: number
  readonly state: string

  constructor(data: ConfigData) {
    this.id = data.id
    this.token = new Token(data.token)
    this.reserve = data.reserve
    this.beneficiary = data.beneficiary
    this.contributionToken = new Token(data.contributionToken)
    this.goal = data.goal
    this.period = data.period
    this.exchangeRate = data.exchangeRate
    this.vestingCliffPeriod = data.vestingCliffDate
    this.vestingCompletePeriod = data.vestingCompleteDate
    this.supplyOfferedPct = data.supplyOfferedPct
    this.fundingForBeneficiaryPct = data.fundingForBeneficiaryPct
    this.openDate = data.openDate
    this.vestingCliffDate = data.vestingCliffDate
    this.vestingCompleteDate = data.vestingCompleteDate
    this.totalRaised = data.totalRaised
    this.state = data.state
  }
}
