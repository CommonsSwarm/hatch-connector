import { ErrorUnexpectedResult } from '../../errors'
import { QueryResult } from '@aragon/connect-thegraph'
import { HatchConfigData } from '../../types'
import GeneralConfig from '../../models/GeneralConfig'

export function parseGeneralConfig(result: QueryResult): GeneralConfig {
  const generalConfig = result.data.generalConfig
  const hatchConfig = generalConfig.hatch

  if (!generalConfig) {
    throw new ErrorUnexpectedResult('Unable to parse general config.')
  }

  /**
   * BigInt values are always received as string. Need to convert some
   * of them to numbers
   */
  const hatchConfigData: HatchConfigData = {
    ...hatchConfig,
    openDate: Number(hatchConfig.openDate),
    period: Number(hatchConfig.period),
    vestingCliffPeriod: Number(hatchConfig.vestingCliffPeriod),
    vestingCompletePeriod: Number(hatchConfig.vestingCompletePeriod),
    vestingCliffDate: Number(hatchConfig.vestingCliffDate),
    vestingCompleteDate: Number(hatchConfig.vestingCompleteDate),
  }

  generalConfig.hatch = hatchConfigData

  return new GeneralConfig(generalConfig)
}
