import { useSportsDbFetch } from "../../hooks/useSportsDbFetch"
import { buildPlayerStatsUrl } from "../../api/endpoints"
import { pivotPlayerStats } from "../../utils/stats"

function PlayerStats({ playerId }) {
    const result = useSportsDbFetch(() => buildPlayerStatsUrl(playerId), [playerId])
    const stats = result.data?.playerstats ?? []

    const rows = pivotPlayerStats(stats)
    const columns = [...new Set(rows.flatMap(r => Object.keys(r.stats)))]

    return(
        <>
            <h3>Stats</h3>
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
                        <tr key={`${row.season}|${row.league}`}>
                            <td>{row.season}</td>
                            <td>{row.league}</td>
                            {columns.map(col => (
                                <td key={col}>{row.stats[col] ?? "—"}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default PlayerStats