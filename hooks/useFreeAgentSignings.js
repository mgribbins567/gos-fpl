import { useEffect, useState } from "react";

export function useFreeAgentSignings(league, gameweekId, supabase) {
  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    if (!league || !gameweekId) return;
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("TransactionLog")
        .select("*")
        .eq("league_id", league.id)
        .eq("gameweek_id", gameweekId)
        .eq("type", "free_agent")
        .order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    }

    load()
      .then((data) => !cancelled && setState({ data, error: null }))
      .catch(
        (err) =>
          !cancelled && setState({ data: undefined, error: err.message }),
      );
    return () => {
      cancelled = true;
    };
  }, [league, gameweekId, supabase]);

  return state;
}
