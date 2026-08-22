import { useState } from "react"
import { Link } from "react-router-dom"
import Collapsible from "../common/Collapsible"
import TeamScheduleCard from "./TeamScheduleCard"

function TeamOverviewTab({ team, teamId }) {
    const [descriptionOpen, setDescriptionOpen] = useState(true)
    
    return(
        <div className="team-overview">
            <div className="team-overview__header">
                <img className="team-overview__badge" src={team.strBadge} alt={`${team.strTeam} logo`} role="img"/>
                <div>
                    <h1 role="heading">{team.strTeam}</h1>
                    {team?.strLeague && (
                        <Link className="team-overview__league" to="/">{team.strLeague}</Link>
                    )}
                </div>
            </div>

            <div className="team-overview__meta">
                {team?.strStadium && (
                    <p>{team.strStadium} {team.intStadiumCapacity && `· Capacity ${Number(team.intStadiumCapacity).toLocaleString('en-US')}`}</p>
                )}
                {team?.intFormedYear && (
                    <p>Founded {team.intFormedYear}</p>
                )}
            </div>

            {team?.strDescriptionEN && (
                <div className="team-overview__description">
                    <button className="team-overview__toggle" onClick={() => setDescriptionOpen(prev => !prev)}>
                        {descriptionOpen ? "Hide" : "Show"} description
                    </button>
                    <Collapsible isOpen={descriptionOpen}>
                        <p>{team.strDescriptionEN}</p>
                    </Collapsible>
                </div>
            )}

            <TeamScheduleCard teamId={teamId} />            
        </div>
    )
}

export default TeamOverviewTab