import { useSportsDbFetch } from "../../hooks/useSportsDbFetch"
import { buildRosterUrl } from "../../api/endpoints"
import { groupBy } from "../../utils/roster"
import Spinner from "../common/Spinner"
import EmptyState from "../common/EmptyState"
import PlayerCard from "./PlayerCard"

function TeamRosterTab({ teamId }) {
    const result = useSportsDbFetch(() => buildRosterUrl(teamId), [teamId]);

    const players = result?.data?.player ?? [];
    const grouped = groupBy(players, (p) => p.srPosition || "Other");

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
            {players.map((p) => (
                <PlayerCard 
                key={p.idPlayer}
                player={p}
                />
            ))}
        </>
    )
}

export default TeamRosterTab