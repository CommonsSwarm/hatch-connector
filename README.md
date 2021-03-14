# Hatch Connector

Connector for the Hatch frontend implemented using [Aragon Connect](https://aragon.org/connect). It connects to a [hatch subgraph](https://github.com/TECommons/hatch-connector/tree/main/subgraph) created using [The Graph](https://thegraph.com/) indexing protocol.

The hatch subgraph collects, store and index hatch-related data from the blockchain and serves it through a [GraphQL](https://graphql.org/) endpoint. The connector is an abstraction over this subgraph which offers an API that can be use by any client to fetch data.

## API Reference

See [API.md](./API.md)

## Usage

### Set up

1.  Add the following dependencies to your project:

    ```sh
    yarn add @aragon/connect
    yarn add @tecommons/connect-hatch
    ```

2.  Import them:

    ```js
    import connect from '@aragon/connect'
    import connectHatch from '@tecommons/connect-hatch'
    ```

3.  Set up the connector:

    ```js
    const org = await connect(DAO_ADDRESS_OR_ENS, 'thegraph', { network: CHAIN_ID })
    
    const hatchApp = await org.app('marketplace-hatch')

    const hatchConnector = await connectHatch(hatchApp)
    ```


### Set up in a React App

1.  Add the following dependencies to your project:

    ```sh
    yarn add @aragon/connect-react
    yarn add @tecommons/connect-hatch
    ```

2.  Wrap your main `<App/>` component in the `<Connect/>` component provided by the `@aragon/connect-react` library.

    ```jsx
    import { Connect } from '@aragon/connect-react'

    <Connect
        location={DAO_ADDRESS_OR_ENS}
        connector="thegraph"
        options={{
        network: CHAIN_ID,
        }}
    >
        <App />
    </Connect>
    ```

3.  Set up the connector:

    ```js
    import {
        useApp,
    } from '@aragon/connect-react'

    function App() {
        const [hatchConnector, setHatchConnector] = useState(null)
        const [hatchApp] = useApp('marketplace-hatch)

        useEffect(() => {
            if (!hatchApp) {
                return
            }

            let cancelled = false

            const fetchHatchConnector = async () => {
                try {
                    const hatchConnector = await connectHatch(hatchApp)

                    if (!cancelled) {
                        setHatchConnector(hatchConnector)
                    }
                } catch (err) {
                    console.error(`Error fetching hatch connector: ${err}`)
                }
            }

            fetchHatchConnector()

            return () => {
                cancelled = true
            }
        }, [hatchApp])
    }
    ```

### Data fetch example

```js
const contributors = await hatchConnector.contributors({
    first: 100,
    skip: 50,
    orderBy: 'value',
    orderDirection: 'asc',
})
```

### Data updates subscription example

```js
const handler = hatchConnector.onContributors(
    {
        first: 20,
        skip: 5,
        orderBy: 'amount',
        orderDirection: 'desc',
    },
    contributors => {
        console.log('Updated contributors: ', contirbutors)
    }
)

// ...

handler.unsubscribe()
```

### Contract call example

```js
const signer = ethers.getSigner()

const intent = await hatchConnector.open()
const openTxs = intent.transactions

for(let i = 0; i < openTxs.length; i++) {
    const txResponse = await signer.sendTransaction(openTxs[i])
    const txReceipt = await txResponse.wait()
}


```
For more information check out the Aragon Connect [docs](https://connect.aragon.org/).

## Contributing

We welcome community contributions!

Please check out our open [Issues](https://github.com/TECommons/hatch-connector/issues) to get started.


