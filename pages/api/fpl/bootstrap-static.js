import { getBootstrapData } from "../../../api/fantasyService";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const data = await getBootstrapData();
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}
