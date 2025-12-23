import useSWR from "swr";

const fetcher = async ([url, managerA, managerB]) => {
  const response = await fetch(
    `${url}?managerA=${managerA}&managerB=${managerB}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch head-to-head history");
  }
  return response.json();
};

export function useHeadToHeadHistory(managerA, managerB) {
  const { data, error, isLoading } = useSWR(
    ["/api/head-to-head-history", managerA, managerB],
    fetcher
  );

  return {
    headToHeadHistory: data,
    isLoading,
    isError: error,
  };
}
