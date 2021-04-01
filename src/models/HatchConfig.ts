import { HatchConfigData } from '../types'
import ERC20Token from './ERC20Token'

class HatchConfig {
  readonly id: string
  readonly token: ERC20Token
  readonly reserve: string
  readonly beneficiary: string
  readonly contributionToken: ERC20Token
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
  readonly PPM: string

  constructor(data: HatchConfigData) {
    this.id = data.id
    this.token = new ERC20Token(data.token)
    this.reserve = data.reserve
    this.beneficiary = data.beneficiary
    this.contributionToken = new ERC20Token(data.contributionToken)
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
    this.PPM = data.PPM
  }
}

export default HatchConfig
