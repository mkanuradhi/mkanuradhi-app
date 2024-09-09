import React from 'react';
import { Montserrat } from "next/font/google";
import Link from 'next/link';

const montserrat = Montserrat({ subsets: ["latin"] });

export default async function NotFound() {

  return (
    <>
    <html lang="en">
      <body className={`${montserrat.className}`}>
        <div className="text-center my-5">
          <h1>Page Not Found</h1>
          <h3>404</h3>
          <p>The page you&apos;re looking for doesn&apos;t seem to exist. Try going back to <Link href="/"> home</Link> or checking the <em>URL</em>.</p>
        </div>
      </body>
    </html>
    </>
  );
}