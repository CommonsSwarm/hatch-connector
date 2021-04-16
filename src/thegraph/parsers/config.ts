import { QueryResult } from '@1hive/connect-thegraph'
import GeneralConfig from '../../models/GeneralConfig'

export async function parseGeneralConfig(
  result: QueryResult
): Promise<GeneralConfig | null> {
  const generalConfig = result.data.generalConfig

  if (!generalConfig) {
    return null
  }

  return new GeneralConfig(generalConfig)
}
