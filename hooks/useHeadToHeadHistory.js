import { getManagerMatchupData } from "../lib/dataService";
import { useEffect, useState } from "react";

export function useHeadToHeadHistory(managerA, managerB) {
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!managerA || !managerB) {
      return;
    }

    setIsLoading(true);
    getManagerMatchupData(managerA, managerB)
      .then((data) => {
        setHistory(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(
          "Failed to fetch history for: ",
          managerA,
          " vs ",
          managerB,
          "with error: ",
          error
        );
        setIsLoading(false);
      });
  }, [managerA, managerB]);

  return { headToHeadHistory: history, isLoading };
}
