
import ShellWrapper from './ShellWrapper';
import { getUser } from '@src/lib/utils';
import { UserProvider } from '@src/hooks/useUser';
import { cookies } from 'next/headers';
import QueryProvider from '@src/providers/QueryProvider';
import { getInitialUser } from '@src/lib/me';

export default async function LayoutWrapper({ children }) {
  const cookieStore = await cookies()
  const id = cookieStore.get("user_id")?.value
  const user = await getInitialUser(id)

  return (
    <QueryProvider>
      <ShellWrapper initialUser={user}>
        {children}
      </ShellWrapper>
    </QueryProvider>
  )
}