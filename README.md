# Hatch Connector

Aragon connector for the Hatch

## API Reference

See [API.md](./API.md)
## Usage

### Set up

1.  Add the following dependencies to your project:

    ```
    yarn add @aragon/connect
    yarn add @tecommons/connect-hatch
    ```

2.  Import them:

    ```
    import connect from '@aragon/connect'
    import connectHatch from '@tecommons/connect-hatch'
    ```

3.  Set up the connector:

    ```
    const org = await connect(<daoAddress | daoEns>, 'thegraph', { network: <chainId> })

    const hatchApp = await org.app('marketplace-hatch')

    const hatchConnector = await connectHatch(hatchApp)
    ```


### Set up in a React App

1.  Add the following dependencies to your project:

    ```
    yarn add @aragon/connect-react
    yarn add @tecommons/connect-hatch
    ```

2.  Wrap your main `<App/>` component in the `<Connect/>` component provided by the `@aragon/connect-react` library.

    ```
    import { Connect } from '@aragon/connect-react'

    <Connect
        location={<daoAddress | daoEns>}
        connector="thegraph"
        options={{
        network: <chainId>,
        }}
    >
        <App />
    </Connect>
    ```

3.  Set up the connector:

    ```
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

```
const contributors = await hatchConnector.contributors({
    first: 100,
    skip: 50,
    orderBy: 'value',
    orderDirection: 'asc',
})
```

### Data updates subscription example

```
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

```
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


