import { GeneralConfigData } from '../types'
import ContractCache from './helpers/ContractCache'
import HatchConfig from './HatchConfig'
import HatchOracleConfig from './HatchOracleConfig'

class GeneralConfig {
  readonly id: string
  readonly hatchConfig: HatchConfig
  readonly hatchOracleConfig: HatchOracleConfig

  constructor(data: GeneralConfigData, contractCache: ContractCache) {
    this.id = data.id
    this.hatchConfig = new HatchConfig(data.hatch, contractCache)
    this.hatchOracleConfig = new HatchOracleConfig(
      data.hatchOracle,
      contractCache
    )
  }
}

export default GeneralConfig
