import { HatchOracleConfigData } from '../types'
import ERC20Token from './ERC20Token'

class HatchOracleConfig {
  readonly id: string
  readonly scoreToken: ERC20Token
  readonly ratio: string

  constructor(data: HatchOracleConfigData) {
    this.id = data.id
    this.scoreToken = new ERC20Token(data.scoreToken, null)
    this.ratio = data.ratio
  }
}

export default HatchOracleConfig
