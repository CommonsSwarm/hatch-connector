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

export const ALL_CONTRIBUTORS = (type: string) => gql`
  ${type} Contributors($appAddress: String!, $first: Int!, $skip: Int!, $orderBy: String!, $orderDirection: String!) {
    contributors(where: {
      appAddress: $appAddress,
    }, first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      account
      totalAmount
      totalValue
    }
  }
`

export const CONTRIBUTOR = (type: string) => gql`
  ${type} Contributor($id: ID!) {
    contributor(id: $id) {
      id
      account
      totalAmount
      totalValue
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
      contributor {
        id
      }
      value
      amount
      vestedPurchaseId
      createdAt
    }
  }
`
