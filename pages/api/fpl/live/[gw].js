import { getLiveData } from "../../../../api/fantasyService";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { gw } = req.query;

  try {
    const liveData = await getLiveData(gw);
    res.setHeader(
      "Cache-Control",
      "s-maxage=31536000, stale-while-revalidate=30",
    );
    return res.status(200).json(liveData);
  } catch (error) {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
