import { BigNumber } from 'ethers'
import {
  Address,
  App,
  SubscriptionHandler,
  ForwardingPath,
} from '@aragon/connect-core'
import { SubscriptionCallback, IPresaleConnector } from '../types'
import PresaleConfig from './PresaleConfig'
import Contribution from './Contribution'
import Contributor from './Contributor'
import GeneralConfig from './GeneralConfig'
import { buildContributorId } from '../helpers'

const PRESALE_ORACLE_APP = 'hatch-oracle'

export default class Presale {
  #app: App
  #connector: IPresaleConnector

  constructor(connector: IPresaleConnector, app: App) {
    this.#connector = connector
    this.#app = app
  }

  async disconnect(): Promise<void> {
    this.#connector.disconnect()
  }

  generalConfig(): Promise<GeneralConfig> {
    return this.#connector.generalConfig(this.#app.organization.address)
  }

  onGeneralConfig(
    callback: SubscriptionCallback<GeneralConfig>
  ): SubscriptionHandler {
    return this.#connector.onGeneralConfig(
      this.#app.organization.address,
      callback
    )
  }

  contributors({
    first = 1000,
    skip = 0,
    orderBy = 'value',
    orderDirection = 'desc',
  } = {}): Promise<Contributor[]> {
    return this.#connector.contributors(
      this.#app.address,
      first,
      skip,
      orderBy,
      orderDirection
    )
  }

  onContributors(
    { first = 1000, skip = 0, orderBy = 'value', orderDirection = 'desc' } = {},
    callback: SubscriptionCallback<Contributor[]>
  ): SubscriptionHandler {
    return this.#connector.onContributors(
      this.#app.address,
      first,
      skip,
      orderBy,
      orderDirection,
      callback
    )
  }

  contributor(contributor = ''): Promise<Contributor> {
    return this.#connector.contributor(
      buildContributorId(this.#app.address, contributor)
    )
  }

  onContributor(
    contributor = '',
    callback: SubscriptionCallback<Contributor>
  ): SubscriptionHandler {
    return this.#connector.onContributor(
      buildContributorId(this.#app.address, contributor),
      callback
    )
  }

  contributions({
    contributor = '',
    first = 1000,
    skip = 0,
    orderBy = 'value',
    orderDirection = 'desc',
  } = {}): Promise<Contribution[]> {
    return this.#connector.contributions(
      this.#app.address,
      contributor.toLowerCase(),
      first,
      skip,
      orderBy,
      orderDirection
    )
  }

  onContributions(
    {
      contributor = '',
      first = 1000,
      skip = 0,
      orderBy = 'value',
      orderDirection = 'desc',
    } = {},
    callback: SubscriptionCallback<Contribution[]>
  ): SubscriptionHandler {
    return this.#connector.onContributions(
      this.#app.address,
      contributor.toLowerCase(),
      first,
      skip,
      orderBy,
      orderDirection,
      callback
    )
  }

  async open(signerAddress: string): Promise<ForwardingPath> {
    return this.#app.intent('open', [], { actAs: signerAddress })
  }

  async close(signerAddress: string): Promise<ForwardingPath> {
    return this.#app.intent('close', [], { actAs: signerAddress })
  }

  async contribute(
    contributor: Address,
    value: string
  ): Promise<ForwardingPath> {
    const intent = await this.#app.intent('contribute', [value], {
      actAs: contributor,
    })
    const {
      presaleConfig: {
        contributionToken: { id: tokenAddress },
      },
    } = await this.#connector.generalConfig(this.#app.address)
    const preTransactions = []

    const collateralPreTransactions = await intent.buildApprovePreTransactions({
      address: tokenAddress,
      value,
    })

    preTransactions.push(...collateralPreTransactions)

    intent.applyPreTransactions(preTransactions)

    return intent
  }

  async refund(
    contributor: Address,
    vestedPurchaseId: number
  ): Promise<ForwardingPath> {
    return this.#app.intent('refund', [contributor, vestedPurchaseId], {
      actAs: contributor,
    })
  }

  async tokenBalance(entity: Address): Promise<BigNumber> {
    const presale = this.#app.contract()

    return presale.balanceOf(entity)
  }

  async getAllowedContributionAmount(contributor: Address): Promise<BigNumber> {
    const presaleOracleApp = await this.#app.organization.app(
      PRESALE_ORACLE_APP
    )
    const presaleOracle = presaleOracleApp.contract()

    return presaleOracle.allowance(contributor)
  }
}
