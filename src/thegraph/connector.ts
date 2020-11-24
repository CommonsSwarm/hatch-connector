import { GraphQLWrapper, QueryResult } from '@aragon/connect-thegraph'
import { SubscriptionHandler } from '@aragon/connect-core'
import { SubscriptionCallback, IPresaleConnector, Address } from '../types'
import Config from '../models/Config'
import * as queries from './queries'

import { parseConfig } from './parsers'

export function subgraphUrlFromChainId(chainId: number): string | null {
  // Rinkeby
  if (chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/tecommons/aragon-presale-rinkeby-staging'
  }
  return null
}

type PresaleConnectorTheGraphConfig = {
  pollInterval?: number
  subgraphUrl?: string
  verbose?: boolean
}

export default class PresaleConnectorTheGraph implements IPresaleConnector {
  #gql: GraphQLWrapper

  constructor(config: PresaleConnectorTheGraphConfig) {
    if (!config.subgraphUrl) {
      throw new Error(
        'PresaleConnectorTheGraph requires subgraphUrl to be passed.'
      )
    }
    this.#gql = new GraphQLWrapper(config.subgraphUrl, {
      pollInterval: config.pollInterval,
      verbose: config.verbose,
    })
  }

  async disconnect() {
    this.#gql.close()
  }

  onConfig(
    id: string,
    callback: SubscriptionCallback<Config>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.CONFIG('subscription'),
      { id },
      callback,
      (result: QueryResult) => parseConfig(result, this)
    )
  }
}
