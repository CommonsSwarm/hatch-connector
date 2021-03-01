import { PresaleOracleConfigData } from '../types'
import Token from './Token'

export default class PresaleOracleConfig {
  readonly id: string
  readonly scoreToken: Token
  readonly ratio: number

  constructor(data: PresaleOracleConfigData) {
    this.id = data.id
    this.scoreToken = data.scoreToken
    this.ratio = data.ratio
  }
}
