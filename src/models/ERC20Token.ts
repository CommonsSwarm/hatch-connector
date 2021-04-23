import { ERC20TokenData } from '../types'

class ERC20Token {
  readonly id: string
  readonly name: string
  readonly symbol: string
  readonly decimals: string

  constructor(data: ERC20TokenData) {
    this.id = data.id
    this.name = data.name
    this.symbol = data.symbol
    this.decimals = data.decimals
  }
}

export default ERC20Token
