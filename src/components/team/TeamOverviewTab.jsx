import { useState } from "react"
import { Link } from "react-router-dom"
import Collapsible from "../common/Collapsible"

function TeamOverviewTab({ team }) {
    const [descriptionOpen, setDescriptionOpen] = useState(false)
    
    return(
        <>
            <img src={team.strBadge} alt={`${team.strTeam} logo`} role="img"/>
            <h1 role="heading">{team.strTeam}</h1>

            {team?.strLeague && (
                <Link to="/">{team.strLeague}</Link>)}

            {team?.strStadium && (
                <p>{team.strStadium} {team.intStadiumCapacity}</p>
            )}
            {team?.intFormedYear && (
                <p>Founded {team.intFormedYear}</p>
            )}

            {team?.strDescriptionEN && (
                <>
                    <button onClick={() => setDescriptionOpen(prev => !prev)}>
                        {descriptionOpen ? "Hide" : "Show"} description
                    </button>
                    <Collapsible isOpen={descriptionOpen}>
                        {team.strDescriptionEN}
                    </Collapsible>
                </>
            )}            
        </>
    )
}

export default TeamOverviewTab