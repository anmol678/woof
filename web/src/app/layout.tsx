import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { ReactQueryClientProvider } from '@/query-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-background shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                    <span className="text-2xl font-bold text-orange-500">Woof</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
          </main>
        </div>
      </body>
    </html>
  )
}
