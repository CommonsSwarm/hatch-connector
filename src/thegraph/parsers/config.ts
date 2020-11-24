import { ErrorUnexpectedResult } from '../../errors'
import { QueryResult } from '@aragon/connect-thegraph'
import Config from '../../models/Config'

export function parseConfig(
  result: QueryResult,
  connector: any
): Config | null {
  const config = result.data.config

  if (!config) throw new ErrorUnexpectedResult('Unable to parse config.')

  return config ? new Config(config, connector) : null
}
