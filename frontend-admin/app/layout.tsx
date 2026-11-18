import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'S7S CMS - Digital Signage Admin',
  description: 'Content Management System for Digital Signage',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-blue-900 text-white p-4 shadow-lg">
          <div className="container mx-auto flex gap-6">
            <Link href="/admin" className="hover:text-yellow-300 font-semibold">
              📺 Admin CMS
            </Link>
            <Link href="/operator" className="hover:text-yellow-300 font-semibold">
              📞 Operator Antrian
            </Link>
          </div>
        </nav>
        <main className="container mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
