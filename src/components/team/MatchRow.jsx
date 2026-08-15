import { formatEventDateTime } from "../../utils/formatters"
import { getMatchResult } from "../../utils/match"
import Badge from "../common/Badge"

function MatchRow ({ event, teamId, mode }) {
    const dateLabel = formatEventDateTime(event)
    const result = mode === "past" ? getMatchResult(event, teamId) : null

    return(
        <div>
            <span>{dateLabel}</span>
            <span>{event.strHomeTeam} vs {event.strAwayTeam}</span>
            {mode === "past" && (
                <>
                    <span>{event.intHomeScore}-{event.intAwayScore}</span>
                    <Badge result={result}/>
                </>
            )}
        </div>
    )
}

export default MatchRow