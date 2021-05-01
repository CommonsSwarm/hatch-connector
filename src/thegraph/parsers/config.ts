import { QueryResult } from '@1hive/connect-thegraph'
import GeneralConfig from '../../models/GeneralConfig'
import { HatchContractSettings } from 'src/types'

export async function parseGeneralConfig(
  result: QueryResult,
  tokenContracts: HatchContractSettings
): Promise<GeneralConfig | null> {
  const generalConfig = result.data.generalConfig

  if (!generalConfig) {
    return null
  }

  return new GeneralConfig(generalConfig, tokenContracts)
}
