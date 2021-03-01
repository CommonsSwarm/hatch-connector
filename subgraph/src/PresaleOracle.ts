import { store, log } from '@graphprotocol/graph-ts'
import {
  ScoreTokenSet as ScoreTokenSetEvent,
  RatioSet as RatioSetEvent,
} from '../generated/templates/PresaleOracle/PresaleOracle'
import { getPresaleOracleConfigEntity, loadTokenData } from './helpers'

export function handleScoreTokenSet(event: ScoreTokenSetEvent): void {
  const params = event.params
  const presaleOracle = getPresaleOracleConfigEntity(event.address)
  const oldScoreToken = presaleOracle.scoreToken

  log.debug('ScoreTokenSet event received. token: {}', [
    event.params.score.toHexString(),
  ])

  const success = loadTokenData(params.score)

  if (success) {
    presaleOracle.scoreToken = params.score.toHexString()
    store.remove('Token', oldScoreToken)
  }

  presaleOracle.save()
}

export function handleRatioSet(event: RatioSetEvent): void {
  const params = event.params
  const presaleOracle = getPresaleOracleConfigEntity(event.address)

  log.debug('RatioSet event received. ratio: {}', [params.ratio.toString()])

  presaleOracle.ratio = params.ratio

  presaleOracle.save()
}
