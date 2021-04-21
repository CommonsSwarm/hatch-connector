import React from 'react'
import { Connect } from '@1hive/connect-react'
import Info from './Info'

function App() {
  return (
    <Connect
      location="0x610f47Ece09Da2367f295950E5E4Aea581Bc7A23"
      connector="thegraph"
      options={{ network: 100 }}
    >
      <Info />
    </Connect>
  )
}

export default App
