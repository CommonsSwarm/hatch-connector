import { createAppConnector } from '@aragon/connect-core'
import {
  ErrorInvalidApp,
  ErrorInvalidConnector,
  ErrorInvalidNetwork,
} from './errors'
import Presale from './models/Presale'
import PresaleConnectorTheGraph, {
  subgraphUrlFromChainId,
  APP_NAMES,
} from './thegraph/connector'

type Config = {
  subgraphUrl?: string
  pollInterval?: number
}

export default createAppConnector<Presale, Config>(
  ({ app, config, connector, network, orgConnector, verbose }) => {
    if (connector !== 'thegraph') {
      throw new ErrorInvalidConnector(
        `Connector unsupported: ${connector}. Please use a The Graph connector.`
      )
    }

    if (!app.name || !APP_NAMES.includes(app.name)) {
      throw new ErrorInvalidApp(
        `This app (${app.name}) is not compatible with this marketplace presale connector. ` +
          `Please use an app instance of the presale.aragonpm.eth repo.`
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

    const connectorTheGraph = new PresaleConnectorTheGraph({
      pollInterval,
      subgraphUrl,
      verbose,
    })

    return new Presale(connectorTheGraph, app.address)
  }
)
