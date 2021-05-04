export interface ERC20TokenData {
  id: string
  name: string
  symbol: string
  decimals: string
}

export interface HatchOracleConfigData {
  id: string
  scoreToken: ERC20TokenData
  ratio: string
}

export interface HatchConfigData {
  id: string
  token: ERC20TokenData
  reserve: string
  beneficiary: string
  contributionToken: ERC20TokenData
  minGoal: string
  maxGoal: string
  period: string
  exchangeRate: string
  vestingCliffPeriod: string
  vestingCompletePeriod: string
  supplyOfferedPct: string
  fundingForBeneficiaryPct: string
  openDate: string
  vestingCliffDate: string
  vestingCompleteDate: string
  totalRaised: string
  state: string
  PPM: string
}

export interface GeneralConfigData {
  id: string
  hatch: HatchConfigData
  hatchOracle: HatchOracleConfigData
}

export interface ContributorData {
  id: string
  account: string
  totalAmount: string
  totalValue: string
}

export interface ContributionData {
  id: string
  contributorId: string
  value: string
  amount: string
  vestedPurchaseId: string
  createdAt: string
}
