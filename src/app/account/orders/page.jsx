import React from 'react'
import AccountPage from '@/components/pages/Account'

export const metadata = {
  title: 'My Orders — Astride Furniture',
  description: 'View and track your past orders and premium chair purchases.',
}

export default function Page() {
  return <AccountPage activeTab="orders" />
}
