import { App, createAppConnector } from '@1hive/connect-core'
import { Contract } from '@ethersproject/contracts'
import {
  ErrorInvalidApp,
  ErrorInvalidConnector,
  ErrorInvalidNetwork,
} from './errors'
import Hatch from './models/Hatch'
import HatchConnectorTheGraph, {
  subgraphUrlFromChainId,
  APP_NAMES_WHITELIST,
} from './thegraph/connector'
import { HatchContractSettings } from './types'
import { HATCH_ORACLE_APP, IMPACT_HOURS_APP } from './utils'

import hatchAbi from './abis/Hatch.json'
import hatchOracleAbi from './abis/HatchOracle.json'
import impactHoursAbi from './abis/ImpactHours.json'
import erc20Abi from './abis/ERC20.json'
import agentAbi from './abis/Agent.json'

type Config = {
  subgraphUrl?: string
  staging?: boolean
  pollInterval?: number
}

async function createHatchContractSettings({
  address,
  provider,
  organization,
}: App): Promise<HatchContractSettings> {
  const hatchContract = new Contract(address, hatchAbi, provider)
  const tokenAddress = await hatchContract.token()
  const contributionTokenAddress = await hatchContract.contributionToken()
  const hatchOracleAddress = (await organization.app(HATCH_ORACLE_APP)).address
  const impactHoursAddress = (await organization.app(IMPACT_HOURS_APP)).address
  const reserveAgentAddress = await hatchContract.reserve()

  return {
    hatch: hatchContract,
    token: new Contract(tokenAddress, erc20Abi, provider),
    contributionToken: new Contract(
      contributionTokenAddress,
      erc20Abi,
      provider
    ),
    hatchOracle: new Contract(hatchOracleAddress, hatchOracleAbi, provider),
    impactHours: new Contract(impactHoursAddress, impactHoursAbi, provider),
    reserveAgent: new Contract(reserveAgentAddress, agentAbi, provider),
  }
}

export default createAppConnector<Hatch, Config>(
  async ({ app, config, connector, network, orgConnector, verbose }) => {
    if (connector !== 'thegraph') {
      throw new ErrorInvalidConnector(
        `Connector unsupported: ${connector}. Please use a The Graph connector.`
      )
    }

    if (!app.name || !APP_NAMES_WHITELIST.includes(app.name)) {
      throw new ErrorInvalidApp(
        `This app (${app.name}) is not compatible with this connector. ` +
          `Please use an app instance of one of these repos: ${APP_NAMES_WHITELIST.toString()}.`
      )
    }

    const subgraphUrl =
      config?.subgraphUrl ??
      subgraphUrlFromChainId(network.chainId, config?.staging) ??
      undefined

    if (!subgraphUrl) {
      throw new ErrorInvalidNetwork(
        'No subgraph could be found for this network. ' +
          'Please provide a subgraphUrl or use one of the supported networks.'
      )
    }

    let pollInterval
    if (orgConnector.name === 'thegraph') {
      pollInterval =
        config?.pollInterval ?? orgConnector.config?.pollInterval ?? undefined
    }

    const hatchContractSettings: HatchContractSettings = await createHatchContractSettings(
      app
    )

    const connectorTheGraph = new HatchConnectorTheGraph({
      pollInterval,
      subgraphUrl,
      verbose,
    })

    return new Hatch(connectorTheGraph, app, hatchContractSettings)
  }
)
