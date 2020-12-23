import { ConfigData } from '../types'
import Token from './Token'

export default class Config {
  readonly id: string
  readonly token: Token
  readonly reserve: string
  readonly beneficiary: string
  readonly contributionToken: Token
  readonly minGoal: string
  readonly maxGoal: string
  readonly period: number
  readonly exchangeRate: string
  readonly vestingCliffPeriod: number
  readonly vestingCompletePeriod: number
  readonly supplyOfferedPct: string
  readonly fundingForBeneficiaryPct: string
  readonly openDate: string
  readonly vestingCliffDate: number
  readonly vestingCompleteDate: number
  readonly totalRaised: string
  readonly state: string

  constructor(data: ConfigData) {
    this.id = data.id
    this.token = new Token(data.token)
    this.reserve = data.reserve
    this.beneficiary = data.beneficiary
    this.contributionToken = new Token(data.contributionToken)
    this.minGoal = data.minGoal
    this.maxGoal = data.maxGoal
    this.period = data.period
    this.exchangeRate = data.exchangeRate
    this.vestingCliffPeriod = data.vestingCliffPeriod
    this.vestingCompletePeriod = data.vestingCompletePeriod
    this.supplyOfferedPct = data.supplyOfferedPct
    this.fundingForBeneficiaryPct = data.fundingForBeneficiaryPct
    this.openDate = data.openDate
    this.vestingCliffDate = data.vestingCliffDate
    this.vestingCompleteDate = data.vestingCompleteDate
    this.totalRaised = data.totalRaised
    this.state = data.state
  }
}
