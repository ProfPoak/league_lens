import { formatEventDateTime } from "../../utils/formatters"
import { getMatchResult } from "../../utils/match"
import Badge from "../common/Badge"

function MatchRow ({ event, teamId, mode }) {
    const dateLabel = formatEventDateTime(event)
    const result = mode === "past" ? getMatchResult(event, teamId) : null

    return(
        <div className="match-row">
            <span className="match-row__date">{dateLabel}</span>
            <span className="match-row__teams">{event.strHomeTeam} vs {event.strAwayTeam}</span>
            {mode === "past" && (
                <>
                    <span className="match-row__score">{event.intHomeScore}-{event.intAwayScore}</span>
                    <Badge result={result}/>
                </>
            )}
        </div>
    )
}

export default MatchRow