import { ErrorUnexpectedResult } from '../../errors'
import { QueryResult } from '@aragon/connect-thegraph'
import { PresaleConfigData } from '../../types'
import GeneralConfig from '../../models/GeneralConfig'

export function parseGeneralConfig(result: QueryResult): GeneralConfig {
  const generalConfig = result.data.generalConfig
  const presaleConfig = generalConfig.presale

  if (!generalConfig) {
    throw new ErrorUnexpectedResult('Unable to parse general config.')
  }

  /**
   * BigInt values are always received as string. Need to convert some
   * of them to numbers
   */
  const presaleConfigData: PresaleConfigData = {
    ...presaleConfig,
    openDate: Number(presaleConfig.openDate),
    period: Number(presaleConfig.period),
    vestingCliffPeriod: Number(presaleConfig.vestingCliffPeriod),
    vestingCompletePeriod: Number(presaleConfig.vestingCompletePeriod),
    vestingCliffDate: Number(presaleConfig.vestingCliffDate),
    vestingCompleteDate: Number(presaleConfig.vestingCompleteDate),
  }

  generalConfig.presaleConfig = presaleConfigData

  return new GeneralConfig(generalConfig)
}
