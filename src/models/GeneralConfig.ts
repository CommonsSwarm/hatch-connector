import { GeneralConfigData } from '../types'
import HatchConfig from './HatchConfig'
import HatchOracleConfig from './HatchOracleConfig'

class GeneralConfig {
  readonly id: string
  readonly hatchConfig: HatchConfig
  readonly hatchOracleConfig: HatchOracleConfig

  constructor(data: GeneralConfigData) {
    this.id = data.id
    this.hatchConfig = data.hatch
    this.hatchOracleConfig = data.hatchOracle
  }
}

export default GeneralConfig
