import { Link } from "react-router-dom"

function TeamListItem ({ team }) {

    return (
        <Link to={`/team/${team.idTeam}`} className="team-list-item">
            <img src={team.strBadge} alt={`${team.strTeam} logo`} />
            <h3>{team.strTeam}</h3>
        </Link>
    )
}

export default TeamListItem