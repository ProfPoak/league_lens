import { useParams } from "react-router-dom"
import { buildTeamLookupUrl } from "../api/endpoints"
import { useSportsDbFetch } from "../hooks/useSportsDbFetch"

function TeamPage() {
    const { id } = useParams()
    const { data, status, error } = useSportsDbFetch(() => buildTeamLookupUrl(id), [id])

    if (status === "loading" || status === "idle") return <p>Loading...</p>
    if (status === "error") return <p>Couldn't load team.</p>

    const team = data?.teams?.[0]

    if (!team) return <p>Team not found.</p>

    return (
        <>
            <h1>{team.strTeam}</h1>
        </>
    )
}

export default TeamPage