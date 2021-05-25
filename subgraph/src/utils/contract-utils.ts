import { Address } from '@graphprotocol/graph-ts'
import { Hatch as HatchContract } from '../../generated/templates/Hatch/Hatch'

export const ZERO_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export function getOrgAddress(appAddress: Address): Address {
  const hatch = HatchContract.bind(appAddress)
  return hatch.kernel()
}

export function getHatchState(appAddress: Address): i32 {
  const hatch = HatchContract.bind(appAddress)
  return hatch.state()
}
