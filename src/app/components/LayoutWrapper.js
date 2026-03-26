
import ShellWrapper from './ShellWrapper';
import { getUser } from '@src/lib/utils';
import { UserProvider } from '@src/hooks/useUser';
import { cookies } from 'next/headers';

export default async function LayoutWrapper({ children }) {
  const cookieStore = await cookies()
  const id = cookieStore.get("user_id")?.value
  const user = await getUser(id)

  return (
    <UserProvider initialUser={user}>
      <ShellWrapper>
        {children}
      </ShellWrapper>
    </UserProvider>
  )
}