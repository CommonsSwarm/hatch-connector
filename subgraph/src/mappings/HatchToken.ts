import { Address, log } from '@graphprotocol/graph-ts'
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

  if (
    params._from.equals(tokenManagerAddress) ||
    params._to.equals(ZERO_ADDRESS)
  ) {
    const hatchId = getGeneralConfigEntity(getOrgAddress(tokenManagerAddress))
      .hatch
    const hatchConfig = HatchConfigEntity.load(hatchId)
    const contributor = getContributorEntity(
      Address.fromString(hatchConfig.address.toHexString()),
      params._to.equals(ZERO_ADDRESS) ? params._from : params._to
    )
    const contributedAmount = params._amount.times(
      hatchConfig.PPM.div(hatchConfig.exchangeRate)
    )

    log.debug('Transfer event received. from: {} to: {} amount: {}', [
      params._from.toHexString(),
      params._to.toHexString(),
      params._amount.toString(),
    ])

    // Hatch contribution case
    if (params._from.equals(tokenManagerAddress)) {
      contributor.totalValue = contributor.totalValue.plus(contributedAmount)
      contributor.totalAmount = contributor.totalAmount.plus(params._amount)

      contributor.save()
    }
    // Hatch refund case
    else {
      contributor.totalValue = contributor.totalValue.minus(contributedAmount)
      contributor.totalAmount = contributor.totalAmount.minus(params._amount)
      contributor.save()
    }
  }
}
