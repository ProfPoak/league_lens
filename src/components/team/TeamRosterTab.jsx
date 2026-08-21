import { useSportsDbFetch } from "../../hooks/useSportsDbFetch"
import { buildRosterUrl } from "../../api/endpoints"
import { groupBy } from "../../utils/roster"
import Spinner from "../common/Spinner"
import EmptyState from "../common/EmptyState"
import PlayerCard from "./PlayerCard"

function TeamRosterTab({ teamId }) {
    const result = useSportsDbFetch(() => buildRosterUrl(teamId), [teamId]);

    const players = result?.data?.player ?? [];
    const grouped = groupBy(players, (p) => p.strPosition || "Other");

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
        <div className="team-roster">
            <h3>Roster</h3>
            <div className="team-roster__grid">
                {players.map((p) => (
                    <PlayerCard key={p.idPlayer} player={p} />
                ))}
            </div>
        </div>
    )
}

export default TeamRosterTab