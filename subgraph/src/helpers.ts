import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
  GeneralConfig as GeneralConfigEntity,
  HatchConfig as HatchConfigEntity,
  HatchOracleConfig as HatchOracleConfigEntity,
  Contributor as ContributorEntity,
  Contribution as ContributionEntity,
  Token as TokenEntity,
} from '../generated/schema'
import { Hatch as HatchContract } from '../generated/templates/Hatch/Hatch'
import { Token as TokenContract } from '../generated/templates/Hatch/Token'
import { HatchOracle as HatchOracleContract } from '../generated/templates/HatchOracle/HatchOracle'
import { getStateByKey } from './hatch-states'

// const ETH = '0x0000000000000000000000000000000000000000'

// Entity Id Builders

function getGeneralConfigEntityId(orgAddress: Address): string {
  return orgAddress.toHexString()
}

function getHatchConfigEntityId(appAddress: Address): string {
  return appAddress.toHexString()
}

function getHatchOracleConfigEntityId(appAddress: Address): string {
  return appAddress.toHexString()
}

function getContributorEntityId(
  appAddress: Address,
  contributor: Address
): string {
  return (
    'appAddress:' +
    appAddress.toHexString() +
    '-' +
    'contributor:' +
    contributor.toHexString()
  )
}

function getContributionEntityId(
  appAddress: Address,
  contributor: Address,
  vestedPurchaseId: BigInt
): string {
  return (
    'appAddress:' +
    appAddress.toHexString() +
    '-' +
    'contributor:' +
    contributor.toHexString() +
    '-vestedPurchaseId:' +
    vestedPurchaseId.toHexString()
  )
}

// Helpers

export function getOrgAddress(appAddress: Address): Address {
  const hatch = HatchContract.bind(appAddress)
  return hatch.kernel()
}

export function getHatchState(appAddress: Address): i32 {
  const hatch = HatchContract.bind(appAddress)
  return hatch.state()
}

// TheGraph Entities Getters

export function getGeneralConfigEntity(
  orgAddress: Address
): GeneralConfigEntity | null {
  const generalConfigEntityId = getGeneralConfigEntityId(orgAddress)
  let generalConfig = GeneralConfigEntity.load(generalConfigEntityId)

  if (!generalConfig) {
    generalConfig = new GeneralConfigEntity(generalConfigEntityId)
  }

  return generalConfig
}

export function getHatchConfigEntity(
  appAddress: Address
): HatchConfigEntity | null {
  const hatchConfigEntityId = getHatchConfigEntityId(appAddress)
  let hatchConfig = HatchConfigEntity.load(hatchConfigEntityId)

  if (!hatchConfig) {
    hatchConfig = new HatchConfigEntity(hatchConfigEntityId)

    hatchConfig.generalConfig = getOrgAddress(appAddress).toHexString()
  }

  return hatchConfig
}

export function getHatchOracleConfigEntity(
  appAddress: Address
): HatchOracleConfigEntity | null {
  const hatchOracleConfigEntityId = getHatchOracleConfigEntityId(appAddress)
  let hatchOracleConfig = HatchOracleConfigEntity.load(
    hatchOracleConfigEntityId
  )

  if (!hatchOracleConfig) {
    hatchOracleConfig = new HatchOracleConfigEntity(hatchOracleConfigEntityId)

    hatchOracleConfig.generalConfig = getOrgAddress(appAddress).toHexString()
  }

  return hatchOracleConfig
}

export function getContributorEntity(
  appAddress: Address,
  contributor: Address
): ContributorEntity | null {
  const contributorEntityId = getContributorEntityId(appAddress, contributor)
  let contributorEntity = ContributorEntity.load(contributorEntityId)

  if (!contributorEntity) {
    contributorEntity = new ContributorEntity(contributorEntityId)

    contributorEntity.account = contributor
    contributorEntity.totalValue = BigInt.fromI32(0)
    contributorEntity.totalAmount = BigInt.fromI32(0)

    contributorEntity.hatchConfig = appAddress.toHexString()
  }

  return contributorEntity
}

export function getContributionEntity(
  appAddress: Address,
  contributor: Address,
  vestedPurchaseId: BigInt
): ContributionEntity | null {
  const contributionEntityId = getContributionEntityId(
    appAddress,
    contributor,
    vestedPurchaseId
  )
  let contribution = ContributionEntity.load(contributionEntityId)

  if (!contribution) {
    contribution = new ContributionEntity(contributionEntityId)
    contribution.contributor = getContributorEntityId(appAddress, contributor)
    contribution.value = BigInt.fromI32(0)
    contribution.amount = BigInt.fromI32(0)
    contribution.vestedPurchaseId = vestedPurchaseId
    contribution.hatchConfig = appAddress.toHexString()
  }

  return contribution
}

// Loading functions

export function loadTokenData(address: Address): boolean {
  const tokenContract = TokenContract.bind(address)

  /* address may be ETH default address instead of token 
  contract address so check for reverts 
  */
  const symbol = tokenContract.try_symbol()
  if (symbol.reverted) {
    return false
  }

  const token = new TokenEntity(address.toHexString())
  token.symbol = symbol.value
  token.name = tokenContract.name()
  token.decimals = tokenContract.decimals()

  token.save()

  return true
}

export function loadHatchConfig(appAddress: Address): void {
  const generalConfig = getGeneralConfigEntity(getOrgAddress(appAddress))
  const hatchConfig = getHatchConfigEntity(appAddress)
  const hatch = HatchContract.bind(appAddress)

  // Load token data
  const token = hatch.token()
  const success = loadTokenData(token)

  if (success) {
    hatchConfig.token = token.toHexString()
  }

  const contributionToken = hatch.contributionToken()

  // Contribution token can be either a token or ether so we dont
  // need to check loadTokenData() result
  loadTokenData(contributionToken)
  hatchConfig.contributionToken = contributionToken.toHexString()

  // Load hatch params
  hatchConfig.reserve = hatch.reserve()
  hatchConfig.beneficiary = hatch.beneficiary()
  hatchConfig.minGoal = hatch.minGoal()
  hatchConfig.maxGoal = hatch.maxGoal()
  hatchConfig.period = hatch.period()
  hatchConfig.exchangeRate = hatch.exchangeRate()
  hatchConfig.vestingCliffPeriod = hatch.vestingCliffPeriod()
  hatchConfig.vestingCompletePeriod = hatch.vestingCompletePeriod()
  hatchConfig.supplyOfferedPct = hatch.supplyOfferedPct()
  hatchConfig.fundingForBeneficiaryPct = hatch.fundingForBeneficiaryPct()
  hatchConfig.openDate = hatch.openDate()
  hatchConfig.vestingCliffDate = hatch.vestingCliffDate()
  hatchConfig.vestingCompleteDate = hatch.vestingCompleteDate()
  hatchConfig.totalRaised = hatch.totalRaised()
  hatchConfig.stateInt = hatch.state()
  hatchConfig.state = getStateByKey(hatchConfig.stateInt)
  hatchConfig.PPM = hatch.PPM()

  // Set up general config data
  generalConfig.hatch = hatchConfig.id

  generalConfig.save()
  hatchConfig.save()
}

export function loadHatchOracleConfig(appAddress: Address): void {
  const generalConfig = getGeneralConfigEntity(getOrgAddress(appAddress))
  const hatchOracleConfig = getHatchOracleConfigEntity(appAddress)
  const hatchOracle = HatchOracleContract.bind(appAddress)

  // Load token data
  const scoreToken = hatchOracle.score()
  const success = loadTokenData(scoreToken)

  if (success) {
    hatchOracleConfig.scoreToken = scoreToken.toHexString()
  }

  // Load hatch oracle params
  hatchOracleConfig.ratio = hatchOracle.ratio()

  // Set up general config data
  generalConfig.hatchOracle = hatchOracleConfig.id

  generalConfig.save()
  hatchOracleConfig.save()
}
