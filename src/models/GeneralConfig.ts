import { GeneralConfigData } from '../types'
import HatchConfig from './HatchConfig'
import HatchOracleConfig from './HatchOracleConfig'

class GeneralConfig {
  readonly id: string
  readonly hatchConfig: HatchConfig
  readonly hatchOracleConfig: HatchOracleConfig

  constructor(data: GeneralConfigData) {
    this.id = data.id
    this.hatchConfig = new HatchConfig(data.hatch)
    this.hatchOracleConfig = new HatchOracleConfig(data.hatchOracle)
  }
}

export default GeneralConfig
