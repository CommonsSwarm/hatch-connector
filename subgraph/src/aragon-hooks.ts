import { Address, log } from '@graphprotocol/graph-ts'
import { loadHatchConfig, loadHatchOracleConfig } from './helpers'

const HATCH_APP_IDS: string[] = [
  '0x0733919f45ce3305724ccf3354aac9d84f477baa23fbeabcaca5d97ff39acd54', // marketplace-hatch.open.aragonpm.eth
]

const HATCH_ORACLE_APP_IDS: string[] = [
  '0xd39db7b8003314a9e1506df5735424d7e24ff748dab30731a57d8d65b60521e4', // hatch-oracle.open.aragonpm.eth
]

/*
 * Called when an app proxy is detected.
 *
 * Return the name of a data source template if you would like to create it for a given appId.
 * Return null otherwise.
 *
 * The returned name is used to instantiate a template declared in the subgraph manifest file,
 * which must have the same name.
 */
export function getTemplateForApp(appId: string): string | null {
  const isHatchIncluded = HATCH_APP_IDS.includes(appId)
  const isHatchOracleIncluded = HATCH_ORACLE_APP_IDS.includes(appId)

  log.debug('Getting data source template name for appId: {}. Matches: {}', [
    appId,
    isHatchIncluded || isHatchOracleIncluded ? 'yes' : 'no',
  ])

  if (isHatchIncluded) {
    return 'Hatch'
  } else if (isHatchOracleIncluded) {
    return 'HatchOracle'
  } else {
    return null
  }
}

export function onOrgTemplateCreated(orgAddress: Address): void {}

export function onAppTemplateCreated(appAddress: Address, appId: string): void {
  const isHatchIncluded = HATCH_APP_IDS.includes(appId)
  const isHatchOracleIncluded = HATCH_ORACLE_APP_IDS.includes(appId)

  log.debug('Loading app config of app: {} ', [appAddress.toHexString()])

  if (isHatchIncluded) {
    loadHatchConfig(appAddress)
  } else if (isHatchOracleIncluded) {
    loadHatchOracleConfig(appAddress)
  }

  return

}
export function onTokenTemplateCreated(tokenAddress: Address): void {}
