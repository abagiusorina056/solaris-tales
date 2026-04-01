import React from 'react'
import AdminPanel from './AdminPanel';
import { AdminProvider } from './AdminContext';
import { getAdmin } from '@src/lib/getAdmin';
import QueryProvider from '@src/providers/QueryProvider';

export const metadata = {
  title: "Dashboard | Solaris Tales",
  description: "Idk...",
  icons: {
    icon: "/favicon-dashboard.png"
  }
};

const layout = async ({ children }) => {
  const admin = await getAdmin()

  return (
    <QueryProvider>
      <AdminPanel admin={JSON.parse(JSON.stringify(admin))}>
        {children}
      </AdminPanel>
    </QueryProvider>
  )
}

export default layout