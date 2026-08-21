export function getMatchResult(event, teamId) {
    const isHome = event.idHomeTeam === teamId;

    const teamScore = isHome ? event.intHomeScore : event.intAwayScore;
    const oppScore = isHome ? event.intAwayScore : event.intHomeScore;

    if (teamScore == null || oppScore == null) {
        return null;
    }

    if (Number(teamScore) > Number(oppScore)) {
        return "W";
    }
    if (Number(teamScore) < Number(oppScore)) {
        return "L";
    }
    return "D";
}