import { QueryResult } from '@aragon/connect-thegraph'
import { Contract } from 'ethers'
import { HatchConfigData } from '../../types'
import GeneralConfig from '../../models/GeneralConfig'
import { getStateByKey } from '../../hatch-states'

export async function parseGeneralConfig(
  result: QueryResult,
  hatchContract: Contract
): Promise<GeneralConfig | null> {
  const generalConfig = result.data.generalConfig

  if (!generalConfig) {
    return null
  }

  const hatchConfig = generalConfig.hatch

  /**
   * Need to fetch hatch state calling contract directly because
   * the state isn't updated after hatching period is over.
   */
  const updatedState = getStateByKey(await hatchContract.state())

  /**
   * BigInt values are always received as string. Need to convert some
   * of them to numbers
   */
  const hatchConfigData: HatchConfigData = {
    ...hatchConfig,
    state: updatedState,
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
