import { BigNumber } from 'ethers'
import { HATCH_APP } from '../utils'

import { ERC20TokenData } from '../types'
import ContractCache from './helpers/ContractCache'

class ERC20Token {
  #contractCache: ContractCache
  #contractCacheKey: string

  readonly id: string
  readonly name: string
  readonly symbol: string
  readonly decimals: string

  constructor(
    data: ERC20TokenData,
    contractCache: ContractCache,
    contractCacheKey: string
  ) {
    this.#contractCache = contractCache
    this.#contractCacheKey = contractCacheKey

    this.id = data.id
    this.name = data.name
    this.symbol = data.symbol
    this.decimals = data.decimals
  }

  async totalSupply(): Promise<BigNumber> {
    const token = await this.#contractCache.loadContractFromStateVariable(
      await this.#contractCache.loadContractFromOrg(HATCH_APP),
      this.#contractCacheKey,
      'erc20'
    )

    return token.totalSupply()
  }
}

export default ERC20Token
