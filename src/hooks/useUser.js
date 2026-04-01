"use client"

import { useQuery, useQueryClient } from '@tanstack/react-query'

export const useUser = (id = null, initialUser = null) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['user'], 
    queryFn: async () => {
      // const existingData = queryClient.getQueryData(['user']);
      // const activeId = id || existingData?._id;

      // if (!activeId) {
      //   console.warn("useUser: No ID found for fetch");
      //   return null;
      // }

      const res = await fetch(`/api/me`);
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error('Failed to fetch user');
      }

      const data = await res.json();
      return data?.user;
    },
    initialData: initialUser,
    enabled: !!id, 
    staleTime: 0, 
    gcTime: 1000 * 60 * 60,
  })

  // A helper to refresh this specific user's data
  const invalidateUser = () => {
    queryClient.invalidateQueries({ queryKey: ['user'] })
  }

  return { ...query, invalidateUser }
}