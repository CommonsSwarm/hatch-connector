import { ErrorUnexpectedResult } from '../../errors'
import { QueryResult } from '@aragon/connect-thegraph'
import Config from '../../models/Config'
import { ConfigData } from 'src/types'

export function parseConfig(result: QueryResult): Config {
  const config = result.data.config

  if (!config) throw new ErrorUnexpectedResult('Unable to parse config.')

  /**
   * BigInt values are always received as string. Need to convert some
   * of them to numbers
   */
  const configData: ConfigData = {
    ...config,
    openDate: Number(config.openDate),
    period: Number(config.period),
    vestingCliffPeriod: Number(config.vestingCliffPeriod),
    vestingCompletePeriod: Number(config.vestingCompletePeriod),
    vestingCliffDate: Number(config.vestingCliffDate),
    vestingCompleteDate: Number(config.vestingCompleteDate),
  }

  return new Config(configData)
}
