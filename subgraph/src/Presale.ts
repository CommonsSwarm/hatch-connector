import { store, log } from '@graphprotocol/graph-ts'
import {
  SetOpenDate as SetOpenDateEvent,
  Close as CloseEvent,
  Contribute as ContributeEvent,
  Refund as RefundEvent,
} from '../generated/templates/Presale/Presale'
import {
  getConfigEntity,
  getContributionEntity,
  getPresaleState,
} from './helpers'
import {
  STATE_CLOSED,
  STATE_CLOSED_NUM,
  getIntStateByKey,
  getStateByKey,
} from './presale-states'

export function handleSetOpenDate(event: SetOpenDateEvent): void {
  const config = getConfigEntity(event.address)
  const stateKey = getPresaleState(event.address)

  config.openDate = event.params.date
  config.state = getStateByKey(stateKey)
  config.stateInt = getIntStateByKey(stateKey)

  config.save()
}

export function handleClose(event: CloseEvent): void {
  const config = getConfigEntity(event.address)

  log.debug('Closed event received.', [])

  config.state = STATE_CLOSED
  config.stateInt = STATE_CLOSED_NUM

  config.save()
}

export function handleContribute(event: ContributeEvent): void {
  const params = event.params
  const contribution = getContributionEntity(
    event.address,
    params.contributor,
    params.vestedPurchaseId
  )

  contribution.value = params.value
  contribution.amount = params.amount

  log.debug(
    'Contribute event received. contributor: {} value: {} amount: {} vestedPurchaseId: {}',
    [
      params.contributor.toHexString(),
      params.value.toString(),
      params.amount.toString(),
      params.vestedPurchaseId.toString(),
    ]
  )

  contribution.save()
}

export function handleRefund(event: RefundEvent): void {
  const params = event.params
  const contribution = getContributionEntity(
    event.address,
    params.contributor,
    params.vestedPurchaseId
  )

  log.debug(
    'Refund event received. contributor: {} value: {} amount: {} vestedPurchaseId: {}',
    [
      params.contributor.toHexString(),
      params.value.toString(),
      params.amount.toString(),
      params.vestedPurchaseId.toString(),
    ]
  )

  store.remove('Contribution', contribution.id)
}
