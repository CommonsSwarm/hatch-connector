import { BigNumber, Contract } from 'ethers'
import { ErrorUndefinedContract } from '../errors'

import { ERC20TokenData } from '../types'

class ERC20Token {
  #contract: Contract | null

  readonly id: string
  readonly name: string
  readonly symbol: string
  readonly decimals: string

  constructor(data: ERC20TokenData, contract: Contract | null) {
    this.#contract = contract

    this.id = data.id
    this.name = data.name
    this.symbol = data.symbol
    this.decimals = data.decimals
  }

  async totalSupply(): Promise<BigNumber> {
    return this.#contract
      ? this.#contract.totalSupply()
      : Promise.reject(new ErrorUndefinedContract())
  }
}

export default ERC20Token
