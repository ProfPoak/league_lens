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
    const sortedPositions = Object.entries(grouped).sort((a, b) => 
        a[0].localeCompare(b[0])
        );

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
            <p className="api-item__note">
              API free tier will only return the first 10 players of the team
            </p>
            {sortedPositions.map(([position, groupPlayers]) => (
                <div key={position}>
                    <h4>{position}</h4>
                    <div className="team-roster__grid">
                        {groupPlayers.map((p) => (
                            <PlayerCard key={p.idPlayer} player={p} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TeamRosterTab