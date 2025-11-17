import prisma from "../lib/prisma";

export async function getArchivedSeasonData(seasonId) {
  const seasonData = await prisma.season.findUnique({
    where: {
      id: seasonId,
    },
    include: {
      Gameweek: {
        orderBy: {
          gameweek: "asc",
        },
        include: {
          Matchup: {
            orderBy: {
              id: "asc",
            },
          },
        },
      },
    },
  });

  if (!seasonData) {
    throw new Error("Season data not found for ID: " + seasonId);
  }

  return seasonData;
}
