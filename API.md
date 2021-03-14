# Class: Hatch

## Table of contents

### Constructors

- [constructor](API.md#constructor)

### Properties

- [#app](API.md##app)
- [#connector](API.md##connector)

### Methods

- [close](API.md#close)
- [contribute](API.md#contribute)
- [contributions](API.md#contributions)
- [contributor](API.md#contributor)
- [contributors](API.md#contributors)
- [disconnect](API.md#disconnect)
- [generalConfig](API.md#generalconfig)
- [getAllowedContributionAmount](API.md#getallowedcontributionamount)
- [onContributions](API.md#oncontributions)
- [onContributor](API.md#oncontributor)
- [onContributors](API.md#oncontributors)
- [onGeneralConfig](API.md#ongeneralconfig)
- [open](API.md#open)
- [refund](API.md#refund)
- [tokenBalance](API.md#tokenbalance)

## Constructors

### constructor

\+ **new Hatch**(`connector`: IHatchConnector, `app`: App): Hatch)

#### Parameters:

Name | Type | Description
:------ | :------ | ------ |
`connector` | IHatchConnector | Hatch connector object that connects to the subgraph.
`app` | App | Hatch app object.

**Returns:** The Hatch instance that interacts both with the contract and the subgraph.

Defined in: [Hatch.ts:20](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L20)

## Properties

### #app

• `Private` **#app**: App

Defined in: [Hatch.ts:19](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L19)

___

### #connector

• `Private` **#connector**: IHatchConnector

Defined in: [Hatch.ts:20](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L20)

## Methods

### close

▸ **close**(`signerAddress`: string): *Promise*<ForwardingPath\>

Close the hatch.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`signerAddress` | *string* | The transaction signer address.   |

**Returns:** *Promise*<ForwardingPath\>

A promise that resolves to a ForwardingPath
object which contains all the transactions needed to be signed in order to close
the hatch.

Defined in: [Hatch.ts:202](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L202)

___

### contribute

▸ **contribute**(`contributor`: *any*, `value`: *string*): *Promise*<ForwardingPath\>

Contribute to the hatch.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`contributor` | *string* | The address of the contributing entity.   |
`value` | *string* | The amount of contribution tokens to contribute.   |

**Returns:** *Promise*<ForwardingPath\>

A promise that resolves to a ForwardingPath object
which contains all the transactions needed to be signed in order to contribute to the hatch.

Defined in: [Hatch.ts:214](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L214)

___

### contributions

▸ **contributions**(`__namedParameters?`: { `contributor` ; `first` ; `orderBy` ; `orderDirection` ; `skip`  }): *Promise*<Contribution[]\>

Fetch multiple contributions.

#### Parameters:

Name | Type | Description
:------ | :------ | :------ |
`__namedParameters` | *object* | A filtering options object for the query. |
`__namedParameters.contributor` | *string* | The contributor address. |
`__namedParameters.first` | *number* | The number of contributions to obtain. |
`__namedParameters.orderBy` | *string* | The value by which to sort the contributions. |
`__namedParameters.orderDirection` | *string* | The order direction. |
`__namedParameters.skip` | *number* | The number of contributions to skip. |

**Returns:** *Promise*<Contribution[]\>

A promise that resolves to an array of Contribution objects.

Defined in: [Hatch.ts:138](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L138)

___

### contributor

▸ **contributor**(`contributor?`: *string*): *Promise*<Contributor\>

Fetch a single contributor.

#### Parameters:

Name | Type | Default value | Description |
:------ | :------ | :------ | :------ |
`contributor` | *string* | ' ' | The contributor address.  |

**Returns:** *Promise*<Contributor\>

A promise that resolves to the searched contributor.

Defined in: [Hatch.ts:109](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L109)

___

### contributors

▸ **contributors**(`__namedParameters?`: { `first` ; `orderBy` ; `orderDirection` ; `skip`  }): *Promise*<Contributor[]\>

Fetch multiple contributors.

#### Parameters:

Name | Type | Description
:------ | :------ | :------ |
`__namedParameters` | *object* | A filtering options object for the query. |
`__namedParameters.first` | number | The number of contributors to obtain. |
`__namedParameters.orderBy` | string | The value by which to sort the contributors. |
`__namedParameters.orderDirection` | string | The order direction. |
`__namedParameters.skip` | number | The number of contributors to skip. |

**Returns:** *Promise*<Contributor[]\>

A promise which resolves to an array of Contributor objects.

Defined in: [Hatch.ts:67](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L67)

___

### disconnect

▸ **disconnect**(): *Promise*<void\>

Disconnect the connector from the subgraph.

**Returns:** *Promise*<void\>

Defined in: [Hatch.ts:30](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L30)

___

### generalConfig

▸ **generalConfig**(): *Promise*<GeneralConfig\>

Fetch the GeneralConfig object that contains configuration data both of
the hatch and the hatch oracle.

**Returns:** *Promise*<GeneralConfig\>

A promise that resolves to a GeneralConfig
entity object.

Defined in: [Hatch.ts:40](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L40)

___

### getAllowedContributionAmount

▸ **getAllowedContributionAmount**(`contributor`: *string*): *Promise*<BigNumber\>

Return the allowed amount of contribution tokens someone can contribute to the
hatch based on how much score tokens he has.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`contributor` | *string* | A string which contains the address of the contributor.   |

**Returns:** *Promise*<BigNumber\>

A promise that resolves to the allowed
contribution token amount.

Defined in: [Hatch.ts:276](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L276)

___

### onContributions

▸ **onContributions**(`__namedParameters?`: { `contributor` ; `first` ; `orderBy` ; `orderDirection` ; `skip`  }, `callback`: *SubscriptionCallback*<Contribution[]\>): *SubscriptionHandler*

Subscribe to multiple contributions data updates.

#### Parameters:

Name | Type | Description
:------ | :------ | :------ |
`__namedParameters` | *object* | A filtering options object for the query. |
`__namedParameters.contributor` | *string* | The contributor address. |
`__namedParameters.first` | *number* | The number of contributions to obtain. |
`__namedParameters.orderBy` | *string* | The value by which to sort the contributions. |
`__namedParameters.orderDirection` | *string* | The order direction. |
`__namedParameters.skip` | *number* | The number of contributions to skip. |
`callback` | *SubscriptionCallback*<Contribution[]\> | A callback function that receives the updated array of Contribution objects.   |

**Returns:** *SubscriptionHandler*

A function handler used to cancel the subscription
at any time.

Defined in: [Hatch.ts:163](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L163)

___

### onContributor

▸ **onContributor**(`contributor?`: *string*, `callback`: *SubscriptionCallback*<Contributor\>): *SubscriptionHandler*

Subscribe to a single contributor data updates.

#### Parameters:

Name | Type | Default value | Description |
:------ | :------ | :------ | :------ |
`contributor` | *string* | '' | The contributor address.   |
`callback` | *SubscriptionCallback*<Contributor\> | - | A callback function that receives the updated Contributor object data.   |

**Returns:** *SubscriptionHandler*

A function handler used to cancel the subscription
at any time.

Defined in: [Hatch.ts:123](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L123)

___

### onContributors

▸ **onContributors**(`__namedParameters?`: { `first` ; `orderBy` ; `orderDirection` ; `skip`  }, `callback`: *SubscriptionCallback*<Contributor[]\>): *SubscriptionHandler*

Subscribe to multiple contributors data updates.

#### Parameters:

Name | Type | Description
:------ | :------ | :------ |
`__namedParameters` | *object* | A filtering options object for the query. |
`__namedParameters.first` | *number* | The number of contributors to obtain. |
`__namedParameters.orderBy` | *string* | The value by which to sort the contributors. |
`__namedParameters.orderDirection` | *string* | The order direction. |
`__namedParameters.skip` | *number* | The number of contributors to skip. |
`callback` | *SubscriptionCallback*<Contributor[]\> | A callback function that receives the updated array of Contributor objects.   |

**Returns:** *SubscriptionHandler*

A function handler used to cancel the
subscription at any time.

Defined in: [Hatch.ts:90](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L90)

___

### onGeneralConfig

▸ **onGeneralConfig**(`callback`: *SubscriptionCallback*<GeneralConfig\>): *SubscriptionHandler*

Subscribe to the GeneralConfig object updates that contains configuration data both
of the hatch and the hatch oracle.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`callback` | *SubscriptionCallback*<GeneralConfig\> | A callback function that receives the updated general configuration data.   |

**Returns:** *SubscriptionHandler*

A function handler use to cancel the
subscription at any time.

Defined in: [Hatch.ts:52](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L52)

___

### open

▸ **open**(`signerAddress`: *string*): *Promise*<ForwardingPath\>

Open the hatch.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`signerAddress` | *string* | The transaction signer address.   |

**Returns:** *Promise*<ForwardingPath\>

A promise that resolves to a ForwardingPath
object which contains all the transactions needed to be signed in order to open
the hatch.

Defined in: [Hatch.ts:191](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L191)

___

### refund

▸ **refund**(`contributor`: *any*, `vestedPurchaseId`: *number*): *Promise*<ForwardingPath\>

Refund a contributor hatch contribution.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`contributor` | *string* | The address of the contributor.   |
`vestedPurchaseId` | *number* | The id of the vested hatch tokens purchase.   |

**Returns:** *Promise*<ForwardingPath\>

A promise that resolves to a ForwardingPath
object which contains all the transactions needed to be signed in order to get
a refund from the hatch.

Defined in: [Hatch.ts:248](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L248)

___

### tokenBalance

▸ **tokenBalance**(`entity`: *string*): *Promise*<BigNumber\>

Fetch a holder's contribution token balance.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`entity` | *string* | A string that contains the token holder address.   |

**Returns:** *Promise*<BigNumber\>

A promise that resolves to the holder
token balance.

Defined in: [Hatch.ts:263](https://github.com/TECommons/hatch-connector/blob/a656ae6/src/models/Hatch.ts#L263)
