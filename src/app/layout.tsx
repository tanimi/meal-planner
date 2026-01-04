import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
