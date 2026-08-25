import { useQuery } from "@tanstack/react-query";

export function useSupabaseQuery(queryKey, queryFn, options = {}) {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5, // default: 5 min
    ...options,
  });
}
