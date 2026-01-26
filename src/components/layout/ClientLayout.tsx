'use client'

import { ReactNode } from 'react'
import { SupportFooter } from './SupportFooter'

interface ClientLayoutProps {
  children: ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1">
        {children}
      </div>
      <SupportFooter />
    </div>
  )
}
