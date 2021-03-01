import { GeneralConfigData } from '../types'
import PresaleConfig from './PresaleConfig'
import PresaleOracleConfig from './PresaleOracleConfig'

export default class GeneralConfig {
  readonly id: string
  readonly presaleConfig: PresaleConfig
  readonly presaleOracleConfig: PresaleOracleConfig

  constructor(data: GeneralConfigData) {
    this.id = data.id
    this.presaleConfig = data.presale
    this.presaleOracleConfig = data.presaleOracle
  }
}
