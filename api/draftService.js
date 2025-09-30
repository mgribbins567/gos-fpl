import { checkElementId } from "../lib/player_util";

// https://draft.premierleague.com/api/entry/${managerId}/event/${gameweekId}
// "picks":
// [ {"element", "position"} ]
// picks.element: Player ID
// picks.position: Player position in lineup

export async function calculateDraftManagerScore(
  managerId,
  gameweekId,
  playerScoreMap
) {
  const teamRes = await fetch(
    `https://draft.premierleague.com/api/entry/${managerId}/event/${gameweekId}`
  );
  const teamData = await teamRes.json();

  if (!teamData || !teamData.picks) {
    return { totalScore: 0, team: [] };
  }

  let totalScore = 0;
  const team = teamData.picks.map((pick) => {
    const elementId = checkElementId(pick.element);
    const score = playerScoreMap.get(elementId).points || 0;
    if (pick.position < 12) {
      totalScore += score;
    }
    return {
      id: elementId,
      name: playerScoreMap.get(elementId).web_name,
      score: score,
      minutes: playerScoreMap.get(elementId).minutes,
      stats: playerScoreMap.get(elementId).stats,
    };
  });
  return { totalScore, team };
}

// https://draft.premierleague.com/api/league/${league}/details
//
// "league_entries":
// [{"entry_id","id"}]
// league_entries.entry_id: Used for API call ${managerId}
// league_entries.id: Used as a key and to craft match IDs
//
// "matches":
// [{"event", "finished", "league_entry_1", "league_entry_2"}]
// matches.event: Gameweek of the matchup (gameweekId)
// matches.finished: Boolean if the gameweek has ended
// matches.league_entry_1 and matches.league_entry_2: Manager entry_id
// *matches also contains finalized point values*

export async function getLeagueDetails(league) {
  const leagueDetailsRes = await fetch(
    `https://draft.premierleague.com/api/league/${league}/details`
  );
  return await leagueDetailsRes.json();
}

export async function getPicks({ managerId, gameweek }) {
  const leagueDetailsRes = await fetch(
    `https://draft.premierleague.com/api/league/${league}/details`
  );
  return await leagueDetailsRes.json();
}
