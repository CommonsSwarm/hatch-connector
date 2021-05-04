import agentAbi from './Agent.json'
import erc20Abi from './ERC20.json'
import hatchAbi from './Hatch.json'
import hatchOracleAbi from './HatchOracle.json'
import impactHoursAbi from './ImpactHours.json'
import miniMeAbi from './MiniMeToken.json'

import {
  HATCH_APP,
  HATCH_ORACLE_APP,
  IMPACT_HOURS_APP,
  AGENT_APP,
  ERC20_TOKEN,
  MINIME_TOKEN,
} from '../utils'

export const abis: Map<string, unknown> = new Map([
  [HATCH_APP, hatchAbi],
  [HATCH_ORACLE_APP, hatchOracleAbi],
  [IMPACT_HOURS_APP, impactHoursAbi],
  [AGENT_APP, agentAbi],
  [ERC20_TOKEN, erc20Abi],
  [MINIME_TOKEN, miniMeAbi],
])
