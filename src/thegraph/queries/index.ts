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
      goal
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
  ${type} Contributions($appAddress: String!, $first: Int!, $skip: Int!) {
    contributions(where: {
      appAddress: $appAddress
    }, first: $first, skip: $skip) {
      id
      contributor
      value
      amount
      vestedPurchaseId
    }
  }
`
