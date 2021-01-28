import { GraphQLWrapper, QueryResult } from '@aragon/connect-thegraph'
import { SubscriptionHandler, Address } from '@aragon/connect-core'
import { SubscriptionCallback, IPresaleConnector } from '../types'
import Config from '../models/Config'
import Contribution from '../models/Contribution'
import * as queries from './queries'

import { parseConfig, parseContributions, parseContributors } from './parsers'
import { ErrorException } from '../errors'
import Contributor from 'src/models/Contributor'
import { parseContributor } from './parsers/contributor'

export function subgraphUrlFromChainId(chainId: number): string | null {
  // Rinkeby
  if (chainId === 4) {
    return 'https://api.thegraph.com/subgraphs/name/tecommons/aragon-hatch-rinkeby-staging'
  }
  // xDai
  if (chainId === 100) {
    return 'https://api.thegraph.com/subgraphs/name/tecommons/aragon-hatch-xdai'
  }
  return null
}

export const APP_NAMES_WHITELIST = ['marketplace-hatch']

type PresaleConnectorTheGraphConfig = {
  pollInterval?: number
  appAddress?: Address
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

    if (!config.appAddress) {
      throw new ErrorException(
        'PresaleConnectorTheGraph requires appAddress to be passed.'
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

  config(id: string): Promise<Config> {
    return this.#gql.performQueryWithParser(
      queries.CONFIG('query'),
      { id },
      (result: QueryResult) => parseConfig(result)
    )
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

  contributors(
    appAddress: string,
    first: number,
    skip: number,
    orderBy: string,
    orderDirection: string
  ): Promise<Contributor[]> {
    return this.#gql.performQueryWithParser(
      queries.ALL_CONTRIBUTORS('query'),
      { appAddress, first, skip, orderBy, orderDirection },
      (result: QueryResult) => parseContributors(result)
    )
  }

  onContributors(
    appAddress: string,
    first: number,
    skip: number,
    orderBy: string,
    orderDirection: string,
    callback: SubscriptionCallback<Contributor[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.ALL_CONTRIBUTORS('subscription'),
      { appAddress, first, skip, orderBy, orderDirection },
      callback,
      (result: QueryResult) => parseContributors(result)
    )
  }

  contributor(id: string): Promise<Contributor> {
    return this.#gql.performQueryWithParser(
      queries.CONTRIBUTOR('query'),
      { id },
      (result: QueryResult) => parseContributor(result)
    )
  }

  onContributor(
    id: string,
    callback: SubscriptionCallback<Contributor>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.CONTRIBUTOR('subscription'),
      { id },
      callback,
      (result: QueryResult) => parseContributor(result)
    )
  }

  contributions(
    appAddress: string,
    contributor: string,
    first: number,
    skip: number,
    orderBy: string,
    orderDirection: string
  ): Promise<Contribution[]> {
    return this.#gql.performQueryWithParser(
      queries.ALL_CONTRIBUTIONS('query'),
      { appAddress, contributor, first, skip, orderBy, orderDirection },
      (result: QueryResult) => parseContributions(result)
    )
  }

  onContributions(
    appAddress: string,
    contributor: string,
    first: number,
    skip: number,
    orderBy: string,
    orderDirection: string,
    callback: SubscriptionCallback<Contribution[]>
  ): SubscriptionHandler {
    return this.#gql.subscribeToQueryWithParser(
      queries.ALL_CONTRIBUTIONS('subscription'),
      { appAddress, contributor, first, skip, orderBy, orderDirection },
      callback,
      (result: QueryResult) => parseContributions(result)
    )
  }
}
