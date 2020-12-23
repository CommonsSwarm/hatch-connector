import gql from 'graphql-tag'

export const CONFIG = (type: string) => gql`
  ${type} Config($id: String!) {
    config(id: $id) {
      id
      token {
        id
        name
        symbol
        decimals
      }
      reserve
      beneficiary
      contributionToken {
        id
        name
        symbol
        decimals
      }
      minGoal
      maxGoal
      period
      exchangeRate
      vestingCliffPeriod
      vestingCompletePeriod
      supplyOfferedPct
      fundingForBeneficiaryPct
      openDate
      vestingCliffDate
      vestingCompleteDate
      totalRaised
      state
    }
  }
`

export const ALL_CONTRIBUTIONS = (type: string) => gql`
  ${type} Contributions($appAddress: String!, $contributor: String!, $first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    contributions(where: {
      appAddress: $appAddress,
      contributor_contains: $contributor
    }, first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      contributor
      value
      amount
      vestedPurchaseId
    }
  }
`
