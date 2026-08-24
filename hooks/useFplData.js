import { useEffect, useState, useMemo } from "react";

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

export function useUpcomingFixtures(gameweek) {
  const [state, setState] = useState({ data: undefined, error: null });

  useEffect(() => {
    if (!gameweek) return;
    let cancelled = false;
    const gameweeks = Array.from({ length: 6 }, (_, i) => gameweek + i);

    Promise.all(
      gameweeks.map((gw) =>
        getCached(`fixtures-${gw}`, () => fetchFixturesForGameweek(gw)),
      ),
    )
      .then(
        (results) =>
          !cancelled && setState({ data: results.flat(), error: null }),
      )
      .catch(
        (err) =>
          !cancelled && setState({ data: undefined, error: err.message }),
      );

    return () => {
      cancelled = true;
    };
  }, [gameweek]);

  return { data: state.data, error: state.error };
}

function attachTeamsAndStats(fixtures, bootstrap) {
  const teamsById = new Map(bootstrap.teams.map((t) => [t.id, t]));
  const elementsById = new Map(bootstrap.elements.map((e) => [e.id, e]));

  return fixtures.map((fixture) => ({
    ...fixture,
    team_h_name: teamsById.get(fixture.team_h).name,
    team_a_name: teamsById.get(fixture.team_a).name,
    team_h_short_name: teamsById.get(fixture.team_h).short_name,
    team_a_short_name: teamsById.get(fixture.team_a).short_name,
    stats: fixture.stats.map(({ identifier, a, h }) => ({
      identifier,
      a: a.map(({ value, element }) => ({
        value,
        player: elementsById.get(element).web_name,
      })),
      h: h.map(({ value, element }) => ({
        value,
        player: elementsById.get(element).web_name,
      })),
    })),
  }));
}

export function useFixturesWithTeams(gameweek) {
  const { data: fixtures, error: fixturesError } = useFixtures(gameweek);
  const { data: bootstrap, error: bootstrapError } = useBootstrapStatic();

  const data = useMemo(() => {
    if (!fixtures || !bootstrap) return undefined;
    return attachTeamsAndStats(fixtures, bootstrap);
  }, [fixtures, bootstrap]);

  return { data, error: fixturesError ?? bootstrapError };
}

export function useUpcomingFixturesWithTeams() {
  const { data: fixtures, error: fixturesError } = useUpcomingFixtures();
  const { data: bootstrap, error: bootstrapError } = useBootstrapStatic();

  const data = useMemo(() => {
    if (!fixtures || !bootstrap) return undefined;
    return attachTeamsAndStats(fixtures, bootstrap);
  }, [fixtures, bootstrap]);

  return { data, error: fixturesError ?? bootstrapError };
}
