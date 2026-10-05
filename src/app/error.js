'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../logo/carton-bear-logo.png';
import '../components/Nav.css';
import '../styles/status-page.css';

export default function Error({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="status-page">
      <Image src={logo} alt="Carton Bear" className="status-page-logo" />
      <p className="status-page-code">SOMETHING TORE</p>
      <h1 className="status-page-title">
        Box Got
        <br />
        Damaged.
      </h1>
      <p className="status-page-text">
        Something went wrong while loading this page. Give it another go.
      </p>
      <div className="status-page-actions">
        <button
          type="button"
          className="bear-pill bear-pill--solid"
          onClick={() => retry()}
        >
          Try Again
        </button>
        <Link href="/" className="bear-pill bear-pill--outline">
          Back To Home
        </Link>
      </div>
    </main>
  );
}
