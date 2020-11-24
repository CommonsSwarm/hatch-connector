import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { Config as ConfigEntity } from '../generated/schema'
import { Presale as PresaleContract } from '../generated/templates/Presale/Presale'

// Entity Id Builders

function getConfigEntityId(appAddress: Address): string {
  return appAddress.toHexString()
}

// Helpers

export function getOrgAddress(appAddress: Address): Address {
  const presale = PresaleContract.bind(appAddress)
  return presale.kernel()
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

// Others

export function loadAppConfig(appAddress: Address): void {
  const config = getConfigEntity(appAddress)
  const presale = PresaleContract.bind(appAddress)

  config.save()
}
