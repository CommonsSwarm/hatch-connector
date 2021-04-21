import React from 'react'
import { useOrganization, useApps, useApp } from '@1hive/connect-react'
import connectHatch from '@commonsswarm/connect-hatch'
import LogButton from './LogButton'

export default function Info() {
  const [org] = useOrganization()
  const [apps] = useApps()
  const [hatchConnector, setHatchConnector] = React.useState(null)
  const [contributors, setContributors] = React.useState(null)
  const [hatchApp] = useApp('marketplace-hatch')

  React.useEffect(() => {
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

  React.useEffect(() => {
    let cancelled = false

    const fetchContributors = async () => {
      try {
        const contributors = await hatchConnector.contributors({
          first: 100,
          skip: 50,
          orderBy: 'totalValue',
          orderDirection: 'asc',
        })

        if (!cancelled) {
          setContributors(contributors)
        }
      } catch (err) {
        console.error(`Error fetching hatch connector: ${err}`)
      }
    }

    if (!hatchConnector) {
      return
    }

    fetchContributors()

    return () => {
      cancelled = true
    }
  }, [hatchConnector])

  if (!org) {
    return <div>Loading…</div>
  }

  return (
    <>
      <h1>Organization</h1>
      <div>location: {org.location}</div>
      <div>address: {org.address}</div>

      <h1>Apps</h1>
      {apps?.map((app: any) => (
        <section key={app.address}>
          <h1>
            {app.name} <LogButton value={app} />
          </h1>
          <div>address: {app.address}</div>
          {app.version && <div>version: {app.version}</div>}
        </section>
      ))}
      <h1>Contributors</h1>
      {contributors?.map((contributor: any) => (
        <section key={contributor.address}>
          <div>address: {contributor.address}</div>
        </section>
      ))}
    </>
  )
}
