import { store, log } from '@graphprotocol/graph-ts'
import {
  ScoreTokenSet as ScoreTokenSetEvent,
  RatioSet as RatioSetEvent,
} from '../generated/templates/HatchOracle/HatchOracle'
import { getHatchOracleConfigEntity, loadTokenData } from './helpers'

export function handleScoreTokenSet(event: ScoreTokenSetEvent): void {
  const params = event.params
  const hatchOracle = getHatchOracleConfigEntity(event.address)
  const oldScoreToken = hatchOracle.scoreToken

  log.debug('ScoreTokenSet event received. token: {}', [
    event.params.score.toHexString(),
  ])

  const success = loadTokenData(params.score)

  if (success) {
    hatchOracle.scoreToken = params.score.toHexString()
    store.remove('Token', oldScoreToken)
  }

  hatchOracle.save()
}

export function handleRatioSet(event: RatioSetEvent): void {
  const params = event.params
  const hatchOracle = getHatchOracleConfigEntity(event.address)

  log.debug('RatioSet event received. ratio: {}', [params.ratio.toString()])

  hatchOracle.ratio = params.ratio

  hatchOracle.save()
}
