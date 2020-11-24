import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  Config as ConfigEntity,
  Contribution as ContributionEntity,
  Token as TokenEntity,
} from '../generated/schema'
import {
  Presale as PresaleContract,
  Token as TokenContract,
} from '../generated/templates/Presale/Presale'
import { getStateByKey } from './presale-states'

const ETH = '0x0000000000000000000000000000000000000000'

// Entity Id Builders

function getConfigEntityId(appAddress: Address): string {
  return appAddress.toHexString()
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

export function getPresaleState(appAddress: Address): string {
  const presale = PresaleContract.bind(appAddress)
  return presale.state()
}

// TheGraph Entities Getters

export function getConfigEntity(appAddress: Address): ConfigEntity | null {
  const configEntityId = getConfigEntityId(appAddress)
  let config = ConfigEntity.load(configEntityId)

  if (!config) {
    config = new ConfigEntity(configEntityId)

    config.appAddress = appAddress
    config.orgAddress = getOrgAddress(appAddress)
  }

  return config
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
    contribution.contributor = contributor
    contribution.value = BigInt.fromI32(0)
    contribution.amount = BigInt.fromI32(0)
    contribution.vestedPurchaseId = vestedPurchaseId
    contribution.appAddress = appAddress
    contribution.orgAddress = getOrgAddress(appAddress)
  }

  return contribution
}

// Loading functions

function loadTokenData(address: Address): boolean {
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

export function loadAppConfig(appAddress: Address): void {
  const config = getConfigEntity(appAddress)
  const presale = PresaleContract.bind(appAddress)

  //Load token data
  const token = presale.token()
  const success = loadTokenData(token)

  if (success) {
    config.token = token.toHexString()
  }

  const contributionToken = presale.contributionToken()

  // Contribution token can be either a token or ether so we dont
  // need to check loadTokenData() result
  loadTokenData(contributionToken)
  config.contributionToken = contributionToken.toHexString()

  //Load presale params
  config.reserve = presale.reserve()
  config.beneficiary = presale.beneficiary()
  config.goal = presale.goal()
  config.period = presale.period()
  config.exchangeRate = presale.exchangeRate()
  config.vestingCliffPeriod = presale.vestingCliffPeriod()
  config.vestingCompletePeriod = presale.vestingCompletePeriod()
  config.supplyOfferedPct = presale.supplyOfferedPct()
  config.fundingForBeneficiaryPct = presale.fundingForBeneficiaryPct()
  config.openDate = presale.openDate()
  config.vestingCliffDate = presale.vestingCliffDate()
  config.vestingCompleteDate = presale.vestingCompleteDate()
  config.totalRaised = presale.totalRaised()
  config.stateInt = presale.state()
  config.state = getStateByKey(config.stateInt)
  
  config.save()
}
