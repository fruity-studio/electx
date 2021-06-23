import '../styles/main.css'
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css'
import 'react-calendar/dist/Calendar.css'

import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import web3Helper from '../lib/web3'

function MyApp({ Component, pageProps }) {
  const [account, updateAccount] = useState("")
  const [connected, updateConnected] = useState(null)
  const router = useRouter()

  const connectWallet = async () => {
    // initialize wallet
    try {
      await web3Helper.init()
      updateAccount(web3Helper.account)
      updateConnected(true)
    } catch (error) {
      console.log({ error: "Connection Error" })
      console.error(error)
      updateConnected(false)
    }
  }

  useEffect(() => {
    connectWallet()
  }, [])

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-2">
        <button onClick={connectWallet}>Connect Wallet</button>
      </div>
    )
  }

  const extraProps = {
    account,
    router,
    ...web3Helper,
  }

  return <Component {...pageProps} {...extraProps} />
}

export default MyApp
