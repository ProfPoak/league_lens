const BASE_URL = "https://www.thesportsdb.com/api/v1/json/123";

export const buildTeamsByLeagueUrl = (leagueName) =>
    `${BASE_URL}/search_all_teams.php?l=${leagueName}`;

export const buildLeagueScheduleUrl = (leagueId) =>
  `${BASE_URL}/eventsnextleague.php?id=${leagueId}`;

export const buildTeamLookupUrl = (teamId) =>
  `${BASE_URL}/lookupteam.php?id=${teamId}`;

export const buildRosterUrl = (teamId) =>
  `${BASE_URL}/lookup_all_players.php?id=${teamId}`;

export const buildUpcomingEventsUrl = (teamId) =>
  `${BASE_URL}/eventsnext.php?id=${teamId}`;

export const buildPastEventsUrl = (teamId) =>
  `${BASE_URL}/eventslast.php?id=${teamId}`;

export const buildPlayerLookupUrl = (playerId) =>
  `${BASE_URL}/lookupplayer.php?id=${playerId}`;

export const buildPlayerStatsUrl = (playerId) =>
  `${BASE_URL}/lookupplayerstats.php?id=${playerId}`;