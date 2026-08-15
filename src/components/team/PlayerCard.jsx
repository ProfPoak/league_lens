import { Link } from "react-router-dom"

function PlayerCard ({ player }) {
    return (
        <Link to={`/player/${player.idPlayer}`}>
            {player?.strCutout && (
                <img src={player.strCutout} alt={`${player.strPlayer} cutout`} />
            )}
            <h4>{player.strPlayer}</h4>
            {player?.strPosition && (
                <p>{player.strPosition}</p>
            )}
            {player?.strNationality && (
                <p>{player.strNationality}</p>
            )}
        </Link>
    )
}

export default PlayerCard