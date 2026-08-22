import { useSportsDbFetch } from "../../hooks/useSportsDbFetch"
import { buildPlayerStatsUrl } from "../../api/endpoints"
import { pivotPlayerStats } from "../../utils/stats"

function PlayerStats({ playerId }) {
    const result = useSportsDbFetch(() => buildPlayerStatsUrl(playerId), [playerId])
    const stats = result.data?.playerstats ?? []

    return(
        <>
            <h3>Stats</h3>
            {pivotPlayerStats(stats)}
        </>
    )
}

export default PlayerStats