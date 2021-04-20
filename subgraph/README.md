# Hatch Subgraph

Subgraph that indexes data from the [Hatch app](https://github.com/CommonsSwarm/hatch-app). It tracks any hatch, token and hatch oracle configuration data as well as any contributor and their contributions.

Currently there is a subgraph deployed on the [xdai](https://thegraph.com/explorer/subgraph/commonsswarm/aragon-hatch-xdai-staging) network.

## Queries

Below there are a few ways to show how to query the Subgraph for data. The queries show most of the information that can be queried. But there are also many filter options that can be used. Just check out the [querying api](https://thegraph.com/docs/graphql-api). These queries can be used locally or in The Graph Explorer playground.

### Querying the Hatch data

This query fetches configuration data related to the hatch.

```graphql
hatchConfig(id: HATCH_ADDRESS) {
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
    state
}
```

### Querying Contributor Data

This query fetches all the contributors who have contributed more than 45000 contribution tokens. It returns the contributor data and all his contributions.

```graphql
contributors(where: { totalValue_gt: "45000000000000000000000" }) {
    id
    totalValue
    totalAmount
    contributions {
        id
        value
        amount
    }
}
```

### Querying Contributions Data

This query fetches the first 10 biggest contributions.

```graphql
contributions(first: 10, orderBy: value, orderDirection: desc) {
    id
    contributor {
        id
    }
    value
    amount
    createdAt
    vestedPurchaseId
    createdAt
}
```


For more information see The Graph [docs](https://thegraph.com/docs/) and the Aragon Connect [docs](https://connect.aragon.org/advanced/app-subgraphs).