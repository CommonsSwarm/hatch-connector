export function buildContributorId(
  appAddress: string,
  contributor: string
): string {
  return `appAddress:${appAddress.toLowerCase()}-contributor:${contributor.toLowerCase()}`
}
