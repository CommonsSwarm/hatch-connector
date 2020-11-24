import { Address, log } from '@graphprotocol/graph-ts'
import { loadAppConfig } from './helpers'

const APP_IDS: string[] = [
  // '0x18ce74b30150639f7fc9fe8c791a9d0c56a8b094d163acf86292374cf2e4f24e', //  marketplace-presale.open.aragonpm.eth
  '0x5de9bbdeaf6584c220c7b7f1922383bcd8bbcd4b48832080afd9d5ebf9a04df5', // presale.aragonpm.eth
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
