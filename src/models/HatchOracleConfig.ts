import { HatchOracleConfigData } from '../types'
import ContractCache from './helpers/ContractCache'
import ERC20Token from './ERC20Token'

class HatchOracleConfig {
  readonly id: string
  readonly scoreToken: ERC20Token
  readonly ratio: string

  constructor(data: HatchOracleConfigData, contractCache: ContractCache) {
    this.id = data.id
    this.scoreToken = new ERC20Token(
      data.scoreToken,
      contractCache,
      'scoreToken'
    )
    this.ratio = data.ratio
  }
}

export default HatchOracleConfig
