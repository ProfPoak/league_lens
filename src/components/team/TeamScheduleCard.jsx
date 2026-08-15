import { useSportsDbFetch } from "../../hooks/useSportsDbFetch"
import { buildUpcomingEventsUrl, buildPastEventsUrl } from "../../api/endpoints"
import MatchRow from "./MatchRow"
import Spinner from "../common/Spinner"
import EmptyState from "../common/EmptyState"

function TeamScheduleCard({ teamId }) {
    const upcoming = useSportsDbFetch(() => buildUpcomingEventsUrl(teamId), [teamId])
    const past = useSportsDbFetch(() => buildPastEventsUrl(teamId), [teamId])

    const nextEvent = upcoming?.data?.events?.[0] ?? null
    const pastEvent = past?.data?.results ?? []

    
    return(
        <section className="schedule-card">
            <h3>Next Game</h3>
            {upcoming.isLoading && (
                <Spinner />
            )}
            {upcoming.status === "error" && (
                <EmptyState message="Couldn't load next game." />
            )}
            {upcoming.status === "success" && !nextEvent && (
                <EmptyState message="No upcoming game scheduled." />
            )}
            {nextEvent && (
                <MatchRow />
            )}

        </section>
    )
}

export default TeamScheduleCard