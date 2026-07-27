import { getFixtures } from "../../../../api/fantasyService";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { gameweek } = req.query;
  try {
    const data = await getFixtures(gameweek);
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}
