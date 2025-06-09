import React from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>杨博文的个人博客 - 智能AI配图</title>
        <meta name="description" content="杨博文的个人博客，集成AI文生图功能，记录生活、技术和思考" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="杨博文" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}