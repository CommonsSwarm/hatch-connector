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
  getContributorEntity,
  getPresaleState,
} from './helpers'
import {
  STATE_CLOSED,
  STATE_CLOSED_NUM,
  STATE_GOAL_REACHED,
  STATE_GOAL_REACHED_NUM,
  getIntStateByKey,
  getStateByKey,
  STATE_REFUNDING,
  STATE_REFUNDING_NUM,
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
  const contributor = getContributorEntity(event.address, params.contributor)
  const config = getConfigEntity(event.address)

  contributor.totalValue = contributor.totalValue.plus(params.value)
  contributor.totalAmount = contributor.totalAmount.plus(params.amount)
  config.totalRaised = config.totalRaised.plus(params.value)

  if (config.totalRaised.ge(config.minGoal)) {
    config.state = STATE_GOAL_REACHED
    config.stateInt = STATE_GOAL_REACHED_NUM
  }

  contribution.value = params.value
  contribution.amount = params.amount
  contribution.createdAt = event.block.timestamp

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
  contributor.save()
  contribution.save()
}

export function handleRefund(event: RefundEvent): void {
  const params = event.params
  const config = getConfigEntity(event.address)
  const contributor = getContributorEntity(event.address, params.contributor)
  const contribution = getContributionEntity(
    event.address,
    params.contributor,
    params.vestedPurchaseId
  )

  config.state = STATE_REFUNDING
  config.stateInt = STATE_REFUNDING_NUM
  contributor.totalValue = contributor.totalValue.minus(params.value)
  contributor.totalAmount = contributor.totalAmount.minus(params.amount)

  log.debug(
    'Refund event received. contributor: {} value: {} amount: {} vestedPurchaseId: {}',
    [
      params.contributor.toHexString(),
      params.value.toString(),
      params.amount.toString(),
      params.vestedPurchaseId.toString(),
    ]
  )

  config.save()
  contributor.save()
  store.remove('Contribution', contribution.id)
}
