// https://fantasy.premierleague.com/api/bootstrap-static/
//
// "element_types":
// [{"id", "singular_name", "singular_name_short"}]
// element_types.id: Position ID
// element_types.singular_name: Position name (e.g. Forward)
// element_types.singular_name_short: Position name abbreviated (e.g. FWD)
//
// "elements":
// [{"code", "element_type", "id", "first_name", "second_name", "web_name", "team", "team_code"}]
// elements.code:
// elements.id:
// elements.element_type: Position ID, eq to element_types.id
// elements.team: Eq to teams.id
// elements.team_code: Eq to teams.code
// * elements also has season data, including goals, assist, etc. *
//
// "teams":
// [{"code", "id", "name"}]
// teams.code: Eq to elements.code
// teams.id: Eq to elements.id, alphabetical ID
// ------------------------------------------------------------------------ //
// https://fantasy.premierleague.com/api/event/${gameweek}/live/
//
// "elements":
// [{"id", "stats", "explain"}]
// elements.id: Eq to elements.id (I believe)
// elements.stats: Object containing data such as minutes, goals, assists, etc.
// elements.explain: elements.explain.stats is an array of objects that contain what the player earned points for. E.g. 2 points for minutes

export async function getBootstrapData() {
  const boostrapRes = await fetch(
    "https://fantasy.premierleague.com/api/bootstrap-static/"
  );
  return await boostrapRes.json();
}

export async function getLiveData(gameweek) {
  const liveRes = await fetch(
    `https://fantasy.premierleague.com/api/event/${gameweek}/live/`
  );
  return await liveRes.json();
}
