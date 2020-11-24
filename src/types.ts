import Config from './models/Config'

export type SubscriptionHandler = { unsubscribe: () => void }
export type SubscriptionCallback<T> = (error: Error | null, data?: T) => void
export type Address = string

export interface ConfigData {
  id: string
  appAddress: string
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IPresaleConnector {
  disconnect(): Promise<void>
  onConfig(
    id: string,
    callback: SubscriptionCallback<Config>
  ): SubscriptionHandler
}
