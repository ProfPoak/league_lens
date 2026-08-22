import { Link } from "react-router-dom"

function PlayerHeader({ player }) {
    return(
        <>
            {(player.strCutout || player.strThumb) && (
                <img src={player.strCutout || player.strThumb} alt={`${player.strPlayer}`} />
            )}
            <h1>{player.strPlayer}</h1>

            {player.strTeam && player.idTeam &&(
                <Link to={`/team/${player.idTeam}`}>{player.strTeam}</Link>
            )}

            {player.strPosition && (
                <span>{player.strPosition}</span>
            )}

            {player.strNumber && (
                <span>#{player.strNumber}</span>
            )}
        </>
    )
}

export default PlayerHeader