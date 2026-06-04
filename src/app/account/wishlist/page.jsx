import React from 'react'
import AccountPage from '@/components/pages/Account'

export const metadata = {
  title: 'My Wishlist — Astride Furniture',
  description: 'Manage your saved premium ergonomic seating solutions.',
}

export default function Page() {
  return <AccountPage activeTab="wishlist" />
}
