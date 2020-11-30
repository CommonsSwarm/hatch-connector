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
  STATE_GOAL_REACHED,
  STATE_GOAL_REACHED_NUM,
  getIntStateByKey,
  getStateByKey,
} from './presale-states'

export function handleSetOpenDate(event: SetOpenDateEvent): void {
  const config = getConfigEntity(event.address)
  const stateKey = getPresaleState(event.address)

  log.debug('SetOpenDate event received. date: {}', [
    event.params.date.toString(),
  ])
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
  const config = getConfigEntity(event.address)

  config.totalRaised = config.totalRaised.plus(params.value)

  if (config.totalRaised.ge(config.goal)) {
    config.state = STATE_GOAL_REACHED
    config.stateInt = STATE_GOAL_REACHED_NUM
  }

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

  config.save()
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
