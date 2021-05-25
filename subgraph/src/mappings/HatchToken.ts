import { Address } from '@graphprotocol/graph-ts'
import {
  MiniMeToken as MiniMeTokenContract,
  Transfer as TransferEvent,
} from '../../generated/templates/HatchToken/MiniMeToken'
import { HatchConfig as HatchConfigEntity } from '../../generated/schema'
import {
  ZERO_ADDRESS,
  getContributorEntity,
  getGeneralConfigEntity,
  getOrgAddress,
} from '../utils'

export function handleTransfer(event: TransferEvent): void {
  const params = event.params
  const token = MiniMeTokenContract.bind(event.address)
  const tokenManagerAddress = token.controller()
  const hatchId = getGeneralConfigEntity(getOrgAddress(tokenManagerAddress))
    .hatch
  const hatchConfig = HatchConfigEntity.load(hatchId)

  // Minting case (contributing to the hatch and claiming tokens)
  if (
    (params._from.equals(tokenManagerAddress) &&
      params._to.notEqual(ZERO_ADDRESS)) ||
    (params._from.equals(ZERO_ADDRESS) &&
      params._to.notEqual(tokenManagerAddress))
  ) {
    const contributor = getContributorEntity(
      Address.fromString(hatchConfig.address.toHexString()),
      params._to
    )
    contributor.totalAmount = contributor.totalAmount.plus(params._amount)
    contributor.save()
  }
  // Burning case (refunding hatch tokens and redeeming tokens when rage quitting)
  else if (
    (params._to.equals(tokenManagerAddress) &&
      params._from.notEqual(ZERO_ADDRESS)) ||
    (params._from.notEqual(tokenManagerAddress) &&
      params._to.equals(ZERO_ADDRESS))
  ) {
    const contributor = getContributorEntity(
      Address.fromString(hatchConfig.address.toHexString()),
      params._from
    )
    contributor.totalAmount = contributor.totalAmount.minus(params._amount)
    contributor.save()
  }
}
