import { useEffect, useState } from "react";

const cache = new Map();

function getCached(key, fetcher) {
  if (!cache.has(key)) {
    cache.set(
      key,
      fetcher().catch((err) => {
        cache.delete(key);
        throw err;
      }),
    );
  }
  return cache.get(key);
}

export function useBootstrapStatic() {
  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    let cancelled = false;
    getCached("bootstrap-static", async () => {
      const res = await fetch("/api/fpl/bootstrap-static");
      if (!res.ok) {
        throw new Error(`Failed to load bootstrap-static: ${res.status}`);
      }
      return res.json();
    })
      .then((data) => !cancelled && setState({ data, error: null }))
      .catch(
        (err) =>
          !cancelled && setState({ data: undefined, error: err.message }),
      );
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

async function fetchLive(gameweek) {
  const res = await fetch(`/api/fpl/live/${gameweek}`);
  if (!res.ok)
    throw new Error(`Failed to load live event ${gameweek}: ${res.status}`);
  return res.json();
}

export function useLiveEvent(gameweek) {
  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    if (!gameweek) return;
    let cancelled = false;
    getCached(`live-${gameweek}`, async () => fetchLive(gameweek))
      .then((data) => !cancelled && setState({ data, error: null }))
      .catch(
        (err) =>
          !cancelled && setState({ data: undefined, error: err.message }),
      );
    return () => {
      cancelled = true;
    };
  }, [gameweek]);

  return state;
}

async function fetchFixturesForGameweek(gameweek) {
  const res = await fetch(`/api/fpl/fixtures/${gameweek}`);
  if (!res.ok)
    throw new Error(
      `Failed to load fixtures for gameweek ${gameweek}: ${res.status}`,
    );
  return res.json();
}

export function useFixtures(gameweek) {
  const [state, setState] = useState({ data: undefined, error: null });
  useEffect(() => {
    if (!gameweek) return;
    let cancelled = false;
    const key = `fixtures-${gameweek}`;

    getCached(key, () => fetchFixturesForGameweek(gameweek))
      .then((data) => !cancelled && setState({ data, error: null }))
      .catch(
        (err) =>
          !cancelled && setState({ data: undefined, error: err.message }),
      );

    return () => {
      cancelled = true;
    };
  }, [gameweek]);
  return state;
}
