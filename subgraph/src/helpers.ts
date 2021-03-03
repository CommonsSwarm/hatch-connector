import { Address, BigInt } from '@graphprotocol/graph-ts'
import {
  GeneralConfig as GeneralConfigEntity,
  PresaleConfig as PresaleConfigEntity,
  PresaleOracleConfig as PresaleOracleConfigEntity,
  Contributor as ContributorEntity,
  Contribution as ContributionEntity,
  Token as TokenEntity,
} from '../generated/schema'
import { Presale as PresaleContract } from '../generated/templates/Presale/Presale'
import { Token as TokenContract } from '../generated/templates/Presale/Token'
import { PresaleOracle as PresaleOracleContract } from '../generated/templates/PresaleOracle/PresaleOracle'
import { getStateByKey } from './presale-states'

// const ETH = '0x0000000000000000000000000000000000000000'

// Entity Id Builders

function getGeneralConfigEntityId(orgAddress: Address): string {
  return orgAddress.toHexString()
}

function getPresaleConfigEntityId(appAddress: Address): string {
  return appAddress.toHexString()
}

function getPresaleOracleConfigEntityId(appAddress: Address): string {
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
  const presale = PresaleContract.bind(appAddress)
  return presale.kernel()
}

export function getPresaleState(appAddress: Address): i32 {
  const presale = PresaleContract.bind(appAddress)
  return presale.state()
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

export function getPresaleConfigEntity(
  appAddress: Address
): PresaleConfigEntity | null {
  const presaleConfigEntityId = getPresaleConfigEntityId(appAddress)
  let presaleConfig = PresaleConfigEntity.load(presaleConfigEntityId)

  if (!presaleConfig) {
    presaleConfig = new PresaleConfigEntity(presaleConfigEntityId)

    presaleConfig.appAddress = appAddress
    presaleConfig.orgAddress = getOrgAddress(appAddress)
  }

  return presaleConfig
}

export function getPresaleOracleConfigEntity(
  appAddress: Address
): PresaleOracleConfigEntity | null {
  const presaleOracleConfigEntityId = getPresaleOracleConfigEntityId(appAddress)
  let presaleOracleConfig = PresaleOracleConfigEntity.load(
    presaleOracleConfigEntityId
  )

  if (!presaleOracleConfig) {
    presaleOracleConfig = new PresaleOracleConfigEntity(
      presaleOracleConfigEntityId
    )

    presaleOracleConfig.appAddress = appAddress
    presaleOracleConfig.orgAddress = getOrgAddress(appAddress)
  }

  return presaleOracleConfig
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
    contributorEntity.appAddress = appAddress
    contributorEntity.orgAddress = getOrgAddress(appAddress)
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
    contribution.appAddress = appAddress
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

export function loadPresaleConfig(appAddress: Address): void {
  const generalConfig = getGeneralConfigEntity(getOrgAddress(appAddress))
  const presaleConfig = getPresaleConfigEntity(appAddress)
  const presale = PresaleContract.bind(appAddress)

  // Load token data
  const token = presale.token()
  const success = loadTokenData(token)

  if (success) {
    presaleConfig.token = token.toHexString()
  }

  const contributionToken = presale.contributionToken()

  // Contribution token can be either a token or ether so we dont
  // need to check loadTokenData() result
  loadTokenData(contributionToken)
  presaleConfig.contributionToken = contributionToken.toHexString()

  // Load presale params
  presaleConfig.reserve = presale.reserve()
  presaleConfig.beneficiary = presale.beneficiary()
  presaleConfig.minGoal = presale.minGoal()
  presaleConfig.maxGoal = presale.maxGoal()
  presaleConfig.period = presale.period()
  presaleConfig.exchangeRate = presale.exchangeRate()
  presaleConfig.vestingCliffPeriod = presale.vestingCliffPeriod()
  presaleConfig.vestingCompletePeriod = presale.vestingCompletePeriod()
  presaleConfig.supplyOfferedPct = presale.supplyOfferedPct()
  presaleConfig.fundingForBeneficiaryPct = presale.fundingForBeneficiaryPct()
  presaleConfig.openDate = presale.openDate()
  presaleConfig.vestingCliffDate = presale.vestingCliffDate()
  presaleConfig.vestingCompleteDate = presale.vestingCompleteDate()
  presaleConfig.totalRaised = presale.totalRaised()
  presaleConfig.stateInt = presale.state()
  presaleConfig.state = getStateByKey(presaleConfig.stateInt)
  presaleConfig.PPM = presale.PPM()

  // Set up general config data
  generalConfig.presale = presaleConfig.id

  generalConfig.save()
  presaleConfig.save()
}

export function loadPresaleOracleConfig(appAddress: Address): void {
  const generalConfig = getGeneralConfigEntity(getOrgAddress(appAddress))
  const presaleOracleConfig = getPresaleOracleConfigEntity(appAddress)
  const presaleOracle = PresaleOracleContract.bind(appAddress)

  // Load token data
  const scoreToken = presaleOracle.score()
  const success = loadTokenData(scoreToken)

  if (success) {
    presaleOracleConfig.scoreToken = scoreToken.toHexString()
  }

  // Load presale oracle params
  presaleOracleConfig.ratio = presaleOracle.ratio()

  // Set up general config data
  generalConfig.presaleOracle = presaleOracleConfig.id

  generalConfig.save()
  presaleOracleConfig.save()
}
