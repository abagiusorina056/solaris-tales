"use client"

import { useQuery, useQueryClient } from '@tanstack/react-query'

export const useAdmin = (initialAdmin = null) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['admin'], 
    queryFn: async () => {
      const res = await fetch(`/api/admin/me`);
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error('Failed to fetch user');
      }

      const data = await res.json();
      return data?.admin;

    },
    initialData: initialAdmin, 
    staleTime: 0, 
    gcTime: 1000 * 60 * 60,
  })

  const invalidateAdmin = () => {
    queryClient.invalidateQueries({ queryKey: ['admin'] })
  }

  return { ...query, invalidateAdmin }
}