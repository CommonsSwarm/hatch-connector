import { Address, log } from '@graphprotocol/graph-ts'
import { loadAppConfig } from './helpers'

const APP_IDS: string[] = [
  '0x0733919f45ce3305724ccf3354aac9d84f477baa23fbeabcaca5d97ff39acd54', // marketplace-hatch.open.aragonpm.eth
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
  const isIncluded = APP_IDS.includes(appId)
  log.debug('Getting data source template name for appId: {}. Matches: {}', [
    appId,
    isIncluded ? 'yes' : 'no',
  ])

  if (isIncluded) {
    return 'Presale'
  } else {
    return null
  }
}

export function onOrgTemplateCreated(orgAddress: Address): void {}
export function onAppTemplateCreated(appAddress: Address, appId: string): void {
  log.debug('Loading app config of app: {} ', [appAddress.toHexString()])

  loadAppConfig(appAddress)
}
export function onTokenTemplateCreated(tokenAddress: Address): void {}
