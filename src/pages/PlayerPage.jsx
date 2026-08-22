import { useParams } from "react-router-dom"
import { useSportsDbFetch } from "../hooks/useSportsDbFetch"
import { buildPlayerLookupUrl } from "../api/endpoints"
import Spinner from "../components/common/Spinner"
import EmptyState from "../components/common/EmptyState"
import PlayerHeader from "../components/player/PlayerHeader"
import PlayerBio from "../components/player/PlayerBio"
import PlayerStats from "../components/player/PlayerStats"

function PlayerPage() {
    const { id } = useParams()
    const result = useSportsDbFetch(() => buildPlayerLookupUrl(id))

    if(result.status === "idle" || result.status === "loading") {
        return (
        <Spinner />
        )   
    }

    if(result.status === "error") {
        return (
        <EmptyState message="Couldn't load player." />
        )   
    }

    const player = result.data?.players?.[0]

    if(!player) {
        return(
            <EmptyState message="Player not found." />
        )
    }
    
    return(
        <div className="player-page">
            <PlayerHeader player={player} />
            <PlayerBio player={player} />
            <PlayerStats playerId={id} />
        </div>
    )
}

export default PlayerPage