import { queryOptions, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../src/queryClient";

export function defineQuery(queryKeyFn, queryFn, staleTime) {
  const options = (...args) =>
    queryOptions({
      queryKey: queryKeyFn(...args),
      queryFn: () => queryFn(...args),
      staleTime,
    });

  return {
    useQuery: (...args) => useQuery(options(...args)),
    fetch: (...args) => queryClient.query(options(...args)),
  };
}
