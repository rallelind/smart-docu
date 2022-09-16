import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useState } from 'react'

export async function getStaticProps() {

  const { ENVIRONMENT } = process.env;

  const res = await fetch(`${ENVIRONMENT}/api/pdf-data`)
  const document = await res.json()

  return {
    props: {
      document,
    },
  }
}

export default function Home({ document }) {

  console.log(document)

  const [page, setPage] = useState(3)

  return (
    <div>
      {document.map((text) => (
        <>
          {page === text.page && <p style={{whiteSpace: "pre"}}>{text.text}</p>}
        </>
      ))}
    </div>
  )
}
