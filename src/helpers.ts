export const IMPACT_HOURS_APP = 'impact-hours-beta'
export const HATCH_APP = 'marketplace-hatch'
export const HATCH_ORACLE_APP = 'hatch-oracle'

export function buildContributorId(
  appAddress: string,
  contributor: string
): string {
  return `appAddress:${appAddress.toLowerCase()}-contributor:${contributor.toLowerCase()}`
}
