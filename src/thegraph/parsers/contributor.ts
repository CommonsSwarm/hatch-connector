import { QueryResult } from '@aragon/connect-thegraph'
import { ErrorUnexpectedResult } from '../../errors'
import Contributor from '../../models/Contributor'
import { ContributorData } from '../../types'

export function parseContributors(result: QueryResult): Contributor[] {
  const contributors = result.data.contributors

  if (!contributors) {
    throw new ErrorUnexpectedResult('Unable to parse contributors')
  }

  const datas = contributors.map((c: any) => {
    return {
      id: c.id,
      account: c.account,
      totalAmount: c.totalAmount,
      totalValue: c.totalValue,
    }
  })

  return datas.map((data: ContributorData) => new Contributor(data))
}

export function parseContributor(result: QueryResult): Contributor | null {
  const contributor = result.data.contributor

  if (!contributor) {
    return null
  }

  const data: ContributorData = {
    id: contributor.id,
    account: contributor.account,
    totalAmount: contributor.totalAmount,
    totalValue: contributor.totalValue,
  }

  return new Contributor(data)
}
