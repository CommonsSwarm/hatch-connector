import { HatchOracleConfigData } from '../types'
import Token from './Token'

export default class HatchOracleConfig {
  readonly id: string
  readonly scoreToken: Token
  readonly ratio: number

  constructor(data: HatchOracleConfigData) {
    this.id = data.id
    this.scoreToken = data.scoreToken
    this.ratio = data.ratio
  }
}