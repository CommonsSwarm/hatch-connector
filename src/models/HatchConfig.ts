import { HatchConfigData } from '../types'
import ERC20Token from './ERC20Token'
import { calculateHatchState } from '../utils'
import ContractCache from './helpers/ContractCache'

class HatchConfig {
  readonly id: string
  readonly token: ERC20Token
  readonly reserve: string
  readonly beneficiary: string
  readonly contributionToken: ERC20Token
  readonly minGoal: string
  readonly maxGoal: string
  readonly period: string
  readonly exchangeRate: string
  readonly vestingCliffPeriod: string
  readonly vestingCompletePeriod: string
  readonly supplyOfferedPct: string
  readonly fundingForBeneficiaryPct: string
  readonly openDate: string
  readonly vestingCliffDate: string
  readonly vestingCompleteDate: string
  readonly totalRaised: string
  readonly state: string
  readonly PPM: string

  constructor(data: HatchConfigData, contractCache: ContractCache) {
    this.id = data.id
    this.token = new ERC20Token(data.token, contractCache, 'token')
    this.reserve = data.reserve
    this.beneficiary = data.beneficiary
    this.contributionToken = new ERC20Token(
      data.contributionToken,
      contractCache,
      'contributionToken'
    )
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

    const state = calculateHatchState(this, data.state)
    this.state = state.toUpperCase()
  }
}

export default HatchConfig
