import { useSportsDbFetch } from "../../hooks/useSportsDbFetch"
import { buildPlayerStatsUrl } from "../../api/endpoints"
import { pivotPlayerStats } from "../../utils/stats"
import Spinner from "../common/Spinner"
import EmptyState from "../common/EmptyState"

function PlayerStats({ playerId }) {
    const result = useSportsDbFetch(() => buildPlayerStatsUrl(playerId))
    const stats = result.data?.playerstats ?? []
    
    if(result.isLoading) {
        return <Spinner />
    }

    if(result.status === "error") {
        return <EmptyState message="Couldn't load stats."/>
    }
    
    if(stats.length === 0) {
        return <EmptyState message="No stats available for this player."/>
    }

    const rows = pivotPlayerStats(stats)
    const columns = [...new Set(rows.flatMap(r => Object.keys(r.stats)))]

    return(
        <section className="player-stats">
            <h3 className="player-stats__heading">Stats</h3>
            <div className="player-stats__table-wrap">
                <table className="player-stats__table">
                    <thead>
                        <tr>
                            <th>Season</th>
                            <th>League</th>
                            {columns.map(col => <th key={col}>{col}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr key={`${row.season}|${row.league}`} data-testid="stat-row">
                                <td>{row.season}</td>
                                <td>{row.league}</td>
                                {columns.map(col => (
                                    <td key={col}>{row.stats[col] ?? "—"}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default PlayerStats