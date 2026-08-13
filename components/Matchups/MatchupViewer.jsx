import { Paper, Stack, Text, Skeleton } from "@mantine/core";
import { useManager } from "../../contexts/ManagerContext";
import { useMatchups } from "../../hooks/useLeague";
import { useManagerLeagues } from "../../hooks/useManagerLeagues";
import { Matchup } from "./Matchup";
import { GameweekNavigator } from "../Team/GameweekNavigator";

export function MatchupViewer({ matchups, standings }) {
  if (!matchups || !standings) return;

  return (
    <Stack gap={0} align="center">
      {matchups && standings && (
        <Stack gap={0}>
          {matchups.matchupSummaries.map((matchup) => (
            <Matchup
              manager1={matchup.manager1.name}
              manager2={matchup.manager2.name}
              score1={matchup.manager1.score}
              score2={matchup.manager2.score}
              manager1Pos={
                standings.find((s) => s.name === matchup.manager1.name)?.rank
              }
              manager2Pos={
                standings.find((s) => s.name === matchup.manager2.name)?.rank
              }
              manager1P={
                standings.find((s) => s.name === matchup.manager1.name)
                  ?.leaguePoints
              }
              manager2P={
                standings.find((s) => s.name === matchup.manager2.name)
                  ?.leaguePoints
              }
              manager1Pf={
                standings.find((s) => s.name === matchup.manager1.name)
                  ?.pointsFor
              }
              manager2Pf={
                standings.find((s) => s.name === matchup.manager2.name)
                  ?.pointsFor
              }
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
