import { Header } from '@/components/Header'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { Footer } from '@/components/Footer'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen min-w-screen max-w-none flex flex-col">
      <Header />
      <main className="px-12 flex-grow prose max-w-none">{children}</main>
      <Footer />
      <Toaster />
    </div>
  )
}
