import React from 'react'
import AdminPanel from './AdminPanel';
import { AdminProvider } from './AdminContext';
import { getAdmin } from '@src/lib/getAdmin';

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
    <AdminProvider admin={JSON.parse(JSON.stringify(admin))}>
      <AdminPanel>
        {children}
      </AdminPanel>
    </AdminProvider>
  )
}

export default layout