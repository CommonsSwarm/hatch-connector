import { QueryResult } from '@aragon/connect-thegraph'
import { ErrorUnexpectedResult } from '../../errors'
import Contribution from '../../models/Contribution'
import { ContributionData } from '../../types'

export function parseContributions(result: QueryResult): Contribution[] {
  const contributions = result.data.contributions

  if (!contributions) {
    throw new ErrorUnexpectedResult('Unable to parse contributions')
  }

  const datas = contributions.map((c: any) => {
    return {
      id: c.id,
      contributorId: c.contributor.id,
      value: c.value,
      amount: c.amount,
      vestedPurchaseId: c.vestedPurchaseId,
      createdAt: c.createdAt,
    }
  })

  return datas.map((data: ContributionData) => new Contribution(data))
}
