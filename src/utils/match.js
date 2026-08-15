export function getMatchResult(event, teamId) {
    const isHome = event.idHomeTeam === teamId;

    const teamScore = isHome ? event.intHomeScore : event.intAwayScore;
    const oppScore = isHome ? event.intAwayScore : event.intHomeScore;

    if (teamScore == null || oppScore == null) {
        return null;
    }

    if (teamScore > oppScore) {
        return "W";
    }
    if (teamScore < oppScore) {
        return "L";
    }
    return "D";
}