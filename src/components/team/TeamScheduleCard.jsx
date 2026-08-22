import { useSportsDbFetch } from "../../hooks/useSportsDbFetch"
import { buildUpcomingEventsUrl, buildPastEventsUrl } from "../../api/endpoints"
import MatchRow from "./MatchRow"
import Spinner from "../common/Spinner"
import EmptyState from "../common/EmptyState"

function TeamScheduleCard({ teamId }) {
    const upcoming = useSportsDbFetch(() => buildUpcomingEventsUrl(teamId))
    const past = useSportsDbFetch(() => buildPastEventsUrl(teamId))

    const nextEvent = upcoming?.data?.events?.[0] ?? null
    const lastEvent = past?.data?.results?.[0] ?? null

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
                <MatchRow event={nextEvent} teamId={teamId} mode="upcoming"/>
            )}

            <h3>Last Game</h3>
            {past.isLoading && (
                <Spinner />
            )}
            {past.status === "error" && (
                <EmptyState message="Couldn't load last game." />
            )}
            {past.status === "success" && !lastEvent && (
                <EmptyState message="No recent results." />
            )}
            {lastEvent && (
                <MatchRow event={lastEvent} teamId={teamId} mode="past"/>
            )}

        </section>
    )
}

export default TeamScheduleCard