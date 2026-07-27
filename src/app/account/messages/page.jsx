import AccountPage from "@/components/pages/Account";

export const metadata = {
  title: 'Order Messages | Astride',
  description: 'View custom order notes and support messages from Astride.',
};

export default function MessagesPage() {
  return <AccountPage activeTab="messages" />;
}
