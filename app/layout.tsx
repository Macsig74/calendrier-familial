import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { StoreProvider } from '@/hooks/StoreContext'
import Sidebar from '@/components/layout/Sidebar'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Famille — Organisateur',
  description: 'Calendrier familial, voitures, tâches et voyages',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full bg-slate-50">
        <StoreProvider>
          <Sidebar />
          <div className="ml-16 md:ml-56 min-h-screen flex flex-col">
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  )
}
