import { useSportsDbFetch } from "../../hooks/useSportsDbFetch"
import { buildRosterUrl } from "../../api/endpoints"
import Spinner from "../common/Spinner"
import EmptyState from "../common/EmptyState"

function TeamRosterTab({ teamId }) {
    const result = useSportsDbFetch(() => buildRosterUrl(teamId), [teamId])

    const players = result?.data?.player ?? []

    if (result.isLoading) {
        return (
        <Spinner />
        )
    }

    if (result.status === "error") {
        return (
            <EmptyState message="Couldn't load roster."/>
        )
    }

    if (players.length === 0) {
        return (
        <EmptyState message="No roster data available."/>
        )
    }


    return(
        <>
            <h3>Roster</h3>
            {console.log(result)}
        </>
    )
}

export default TeamRosterTab