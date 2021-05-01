import { Address, log } from '@graphprotocol/graph-ts'
import {
  MiniMeToken as MiniMeTokenContract,
  Transfer as TransferEvent,
} from '../../generated/templates/HatchToken/MiniMeToken'
import {
  HatchConfig as HatchConfigEntity,
  Token as TokenEntity,
} from '../../generated/schema'
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

  if (
    params._from.equals(tokenManagerAddress) ||
    params._to.equals(ZERO_ADDRESS)
  ) {
    const hatchId = getGeneralConfigEntity(getOrgAddress(tokenManagerAddress))
      .hatch
    const hatchConfig = HatchConfigEntity.load(hatchId)
    const token = TokenEntity.load(hatchConfig.token)
    const contributor = getContributorEntity(
      Address.fromString(hatchConfig.address.toHexString()),
      params._to.equals(ZERO_ADDRESS) ? params._from : params._to
    )

    log.debug('Transfer event received. from: {} to: {} amount: {}', [
      params._from.toHexString(),
      params._to.toHexString(),
      params._amount.toString(),
    ])

    // Mint case
    if (params._from.equals(tokenManagerAddress)) {
      contributor.totalAmount = contributor.totalAmount.plus(params._amount)
    }
    // Burn case
    else {
      contributor.totalAmount = contributor.totalAmount.minus(params._amount)
    }

    token.save()
    contributor.save()
  }
}
