import { useParams } from "react-router-dom"

function PlayerPage() {
    const { id } = useParams()

    return(
        <>
        <h1>Welcome to Player {id}</h1>
        </>
    )
}

export default PlayerPage