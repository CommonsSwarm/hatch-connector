import { Organization } from '@1hive/connect-core'
import { Contract, ContractInterface } from 'ethers'
import { abis } from '../../abis'

class ContractCache {
  #cache: Map<string, Contract>
  #org: Organization

  constructor(org: Organization) {
    this.#cache = new Map()
    this.#org = org
  }

  async loadContractFromOrg(appName: string): Promise<Contract> {
    if (this.#cache.has(appName)) {
      return this.#cache.get(appName) as Contract
    } else {
      const appAddress = (await this.#org.app(appName)).address
      const appContract = new Contract(
        appAddress,
        abis.get(appName) as ContractInterface,
        this.#org.connection.ethersProvider
      )
      this.#cache.set(appName, appContract)

      return appContract
    }
  }

  async loadContractFromStateVariable(
    contract: Contract,
    stateVariable: string,
    abiName: string
  ): Promise<Contract> {
    if (this.#cache.has(stateVariable)) {
      return this.#cache.get(stateVariable) as Contract
    } else {
      const keyAddress = await contract[stateVariable]()
      const keyContract = new Contract(
        keyAddress,
        abis.get(abiName) as ContractInterface,
        this.#org.connection.ethersProvider
      )
      this.#cache.set(stateVariable, keyContract)

      return keyContract
    }
  }
}

export default ContractCache
