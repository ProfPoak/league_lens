import { useParams } from "react-router-dom"

function TeamPage() {
    const { id } = useParams()

    return(
        <>
        <h1>Welcome to Team {id}</h1>
        </>
    )
}

export default TeamPage