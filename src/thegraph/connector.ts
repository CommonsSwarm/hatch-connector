import { GraphQLWrapper, QueryResult } from '@aragon/connect-thegraph'
import { SubscriptionHandler } from '@aragon/connect-core'
import { SubscriptionCallback, IPresaleConnector } from '../types'
import Config from '../models/Config'
import Contribution from '../models/Contribution'
import * as queries from './queries'

import { parseConfig, parseContributions } from './parsers'

export function subgraphUrlFromChainId(chainId: number): string | null {
  // Rinkeby
  if (chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/tecommons/aragon-presale-rinkeby-staging'
  }
  // xDai
  if (chainId === 100) {
    return 'https://thegraph.com/explorer/subgraph/tecommons/aragon-presale-xdai'
  }
  return null
}

export const APP_NAMES = ['presale', 'marketplace-presale']

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
      (result: QueryResult) => parseConfig(result)
    )
  }

  contributions(
    appAddress: string,
    first: number,
    skip: number
  ): Promise<Contribution[]> {
    return this.#gql.performQueryWithParser(
      queries.ALL_CONTRIBUTIONS('query'),
      { appAddress, first, skip },
      (result: QueryResult) => parseContributions(result)
    )
  }

  onContributions(
    appAddress: string,
    first: number,
    skip: number,
    callback: SubscriptionCallback<Contribution[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.ALL_CONTRIBUTIONS('subscription'),
      { appAddress, first, skip },
      callback,
      (result: QueryResult) => parseContributions(result)
    )
  }
}
