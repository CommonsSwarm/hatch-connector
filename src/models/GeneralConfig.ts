import { GeneralConfigData, HatchContractSettings } from '../types'
import HatchConfig from './HatchConfig'
import HatchOracleConfig from './HatchOracleConfig'

class GeneralConfig {
  readonly id: string
  readonly hatchConfig: HatchConfig
  readonly hatchOracleConfig: HatchOracleConfig

  constructor(
    data: GeneralConfigData,
    contractSettings: HatchContractSettings
  ) {
    this.id = data.id
    this.hatchConfig = new HatchConfig(data.hatch, contractSettings)
    this.hatchOracleConfig = new HatchOracleConfig(data.hatchOracle)
  }
}

export default GeneralConfig
