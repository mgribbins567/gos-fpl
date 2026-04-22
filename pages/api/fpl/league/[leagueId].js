export default async function GET(req, res) {
  const { leagueId } = req.query;

  const [detailsRes, liveRes] = await Promise.all([
    fetch(`https://draft.premierleague.com/api/league/${leagueId}/details`),
    fetch(`https://draft.premierleague.com/api/game`),
  ]);

  // To add revalidation:
  // next: { revalidate: 60 },

  if (!detailsRes.ok) {
    return res.status(500).json({ error: "Failed to fetch league details" });
  }

  const details = await detailsRes.json();
  const game = liveRes.ok ? await liveRes.json() : null;
  const isLive = !game?.current_event_finished ?? null;

  return res.status(200).json({ details, isLive });
}
