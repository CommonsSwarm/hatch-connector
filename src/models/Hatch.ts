import { BigNumber } from 'ethers'
import {
  Address,
  App,
  SubscriptionHandler,
  ForwardingPath,
} from '@aragon/connect-core'
import { SubscriptionCallback, IHatchConnector } from '../types'
import Contribution from './Contribution'
import Contributor from './Contributor'
import GeneralConfig from './GeneralConfig'
import { buildContributorId } from '../helpers'

const HATCH_ORACLE_APP = 'hatch-oracle'

class Hatch {
  #app: App
  #connector: IHatchConnector

  constructor(connector: IHatchConnector, app: App) {
    this.#connector = connector
    this.#app = app
  }

  /**
   * Disconnect the connector from the subgraph.
   */
  async disconnect(): Promise<void> {
    this.#connector.disconnect()
  }

  /**
   * Fetch the GeneralConfig object that contains configuration data both of
   * the hatch and the hatch oracle.
   * @returns {Promise<GeneralConfig>} A promise that resolves to a GeneralConfig
   * entity object.
   */
  generalConfig(): Promise<GeneralConfig> {
    return this.#connector.generalConfig(this.#app.organization.address)
  }

  /**
   * Subscribe to the GeneralConfig object updates that contains configuration data both
   * of the hatch and the hatch oracle.
   * @param {SubscriptionCallback<GeneralConfig>} callback A callback function that
   * receives the updated general configuration data.
   * @returns {SubscriptionHandler} A function handler use to cancel the
   * subscription at any time.
   */
  onGeneralConfig(
    callback: SubscriptionCallback<GeneralConfig>
  ): SubscriptionHandler {
    return this.#connector.onGeneralConfig(
      this.#app.organization.address,
      callback
    )
  }

  /**
   * Fetch multiple contributors.
   * @param {Object} param0 A filtering options object for the query.
   * @returns {Promise<Contributor[]>} A promise which resolves to an array of Contributor objects.
   */
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

  /**
   * Subscribe to multiple contributors data updates.
   * @param {Object} param0 A filtering options object for the query.
   * @param {SubscriptionCallback<Contributor[]>} callback A callback function that
   * receives the updated array of Contributor objects.
   * @returns {SubscriptionHandler} A function handler used to cancel the
   * subscription at any time.
   */
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

  /**
   * Fetch a single contributor.
   * @param {string} contributor A string that contains the contributor address.
   * @returns {Contributor} A promise that resolves to the searched contributor.
   */
  contributor(contributor = ''): Promise<Contributor> {
    return this.#connector.contributor(
      buildContributorId(this.#app.address, contributor)
    )
  }

  /**
   * Subscribe to a single contributor data updates.
   * @param {string} contributor The contributor address.
   * @param {SubscriptionCallback<Contribution>} callback A callback function that
   * receives the updated Contributor object data.
   * @returns {SubscriptionHandler} A function handler used to cancel the subscription
   * at any time.
   */
  onContributor(
    contributor = '',
    callback: SubscriptionCallback<Contributor>
  ): SubscriptionHandler {
    return this.#connector.onContributor(
      buildContributorId(this.#app.address, contributor),
      callback
    )
  }

  /**
   * Fetch multiple contributions.
   * @param {Object} param0 A filtering options object for the query.
   * @returns {Promise<Contribution[]>} A promise that resolves to an array of Contribution objects.
   */
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

  /**
   * Subscribe to multiple contributions data updates.
   * @param {Object} param0 A filtering options object for the query.
   * @param {SubscriptionCallback<Contribution[]} callback A callback function that
   * receives the updated array of Contribution objects.
   * @returns {SubscriptionHandler} A function handler used to cancel the subscription
   * at any time.
   */
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

  /**
   * Open the hatch.
   * @param {Address} signerAddress A string that contains the transaction signer address.
   * @returns {Promise<ForwardingPath>} A promise that resolves to a ForwardingPath
   * object which contains all the transactions needed to be signed in order to open
   * the hatch.
   */
  async open(signerAddress: Address): Promise<ForwardingPath> {
    return this.#app.intent('open', [], { actAs: signerAddress })
  }

  /**
   * Close the hatch.
   * @param {Address} signerAddress A string that contains the transaction signer address.
   * @returns {Promise<ForwardingPath>} A promise that resolves to a ForwardingPath
   * object which contains all the transactions needed to be signed in order to close
   * the hatch.
   */
  async close(signerAddress: Address): Promise<ForwardingPath> {
    return this.#app.intent('close', [], { actAs: signerAddress })
  }

  /**
   * Contribute to the hatch.
   * @param {Address} contributor The address of the
   * contributing entity.
   * @param {string} value A string that contains the amount of tokens to contribute.
   * @returns {Promise<ForwardingPath>} A promise that resolves to a ForwardingPath object
   * which contains all the transactions needed to be signed in order to contribute to the hatch.
   */
  async contribute(
    contributor: Address,
    value: string
  ): Promise<ForwardingPath> {
    const intent = await this.#app.intent('contribute', [value], {
      actAs: contributor,
    })
    const {
      hatchConfig: {
        contributionToken: { id: tokenAddress },
      },
    } = await this.#connector.generalConfig(this.#app.organization.address)
    const preTransactions = []

    const collateralPreTransactions = await intent.buildApprovePreTransactions({
      address: tokenAddress,
      value,
    })

    preTransactions.push(...collateralPreTransactions)

    intent.applyPreTransactions(preTransactions)

    return intent
  }

  /**
   * Refund a contributor hatch contribution.
   * @param {Address} contributor The address of the contributor.
   * @param {number} vestedPurchaseId The id of the vested hatch tokens purchase.
   * @returns {Promise<ForwardingPath>} A promise that resolves to a Forwarding Path
   * object which contains all the transactions needed to be signed in order to get
   * a refund from the hatch.
   */
  async refund(
    contributor: Address,
    vestedPurchaseId: number
  ): Promise<ForwardingPath> {
    return this.#app.intent('refund', [contributor, vestedPurchaseId], {
      actAs: contributor,
    })
  }

  /**
   * Fetch a holder's contribution token balance.
   * @param {Address} entity A string that contains the token holder address.
   * @returns {Promise<BigNumber>} A promise that resolves to the holder
   * token balance.
   */
  async tokenBalance(entity: Address): Promise<BigNumber> {
    const hatch = this.#app.contract()

    return hatch.balanceOf(entity)
  }

  /**
   * Return the allowed amount of contribution tokens someone can contribute to the
   * hatch based on how much score tokens he has.
   * @param {Address} contributor A string which contains the address of the contributor.
   * @returns {Promise<BigNumber>} A promise that resolves to the allowed
   * contribution token amount.
   */
  async getAllowedContributionAmount(contributor: Address): Promise<BigNumber> {
    const hatchOracleApp = await this.#app.organization.app(HATCH_ORACLE_APP)
    const hatchOracle = hatchOracleApp.contract()

    return hatchOracle.allowance(contributor)
  }
}

export default Hatch
