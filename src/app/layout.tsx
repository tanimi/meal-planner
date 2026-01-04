import type { Metadata } from 'next'
import './globals.css'
import AppWrapper from '@/components/AppWrapper'

export const metadata: Metadata = {
  title: 'Meal Planner',
  description: 'Weekly meal planning for healthy batch cooking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  )
}
