import { createAppConnector } from '@aragon/connect-core'
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

type Config = {
  subgraphUrl?: string
  pollInterval?: number
}

export default createAppConnector<Hatch, Config>(
  ({ app, config, connector, network, orgConnector, verbose }) => {
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
      subgraphUrlFromChainId(network.chainId) ??
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

    const connectorTheGraph = new HatchConnectorTheGraph({
      appAddress: app.address,
      pollInterval,
      subgraphUrl,
      verbose,
    })

    return new Hatch(connectorTheGraph, app)
  }
)
