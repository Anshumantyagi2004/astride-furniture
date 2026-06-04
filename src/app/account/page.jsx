import React from 'react'
import AccountPage from '@/components/pages/Account'

export const metadata = {
  title: 'My Account — Astride Furniture',
  description: 'Manage your Astride profile, contact details, and account settings.',
}

export default function Page() {
  return <AccountPage activeTab="account" />
}
