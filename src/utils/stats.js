import { groupBy } from "./roster";

export function pivotPlayerStats(stats) {
    // key = season + league so club/country or dual competitions in the
    // same year never collide
    const grouped = groupBy(stats, (s) => `${s.strSeason}|${s.strLeague}`);

    const rows = Object.values(grouped).map((entries) => ({
        season: entries[0].strSeason,
        league: entries[0].strLeague,
        team: entries[0].strTeam,
        stats: Object.fromEntries(entries.map((e) => [e.strStatistic, e.strValue])),
    }));

    // most recent season first
    rows.sort((a, b) => b.season.localeCompare(a.season));

    return rows;
}