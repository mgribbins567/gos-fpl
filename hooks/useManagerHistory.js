import { useEffect, useState } from "react";
import { getManagerHistoryData } from "../lib/dataService";

export function useManagerHistory(managerId) {
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!managerId) {
      return;
    }

    setIsLoading(true);
    getManagerHistoryData(managerId)
      .then((data) => {
        setHistory(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(
          "Failed to fetch history for: ",
          managerId,
          "with error: ",
          error
        );
        setIsLoading(false);
      });
  }, [managerId]);

  return { history, isLoading };
}
