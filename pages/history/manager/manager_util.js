export function GetSeasonLink(season_value) {
  switch (season_value) {
    case "S1":
      return "/history/season_22_23";
    case "S2":
      return "/history/season_23_24";
    case "S2 Cup 1":
      return "/history/season_23_24";
    case "S2 Cup 2":
      return "/history/season_23_24";
    case "Total":
      return "/history/all_seasons";
    default:
      return "/history/";
  }
}
