import { Link } from "react-router-dom"

function PlayerCard ({ player }) {
    return (
        <Link to={`/player/${player.idPlayer}`} className="player-card">
            {player?.strCutout && (
                <img className="player-card__img" src={player.strCutout} alt={`${player.strPlayer} cutout`} />
            )}
            <h4 className="player-card__name">{player.strPlayer}</h4>
            {player?.strPosition && <p className="player-card__meta">{player.strPosition}</p>}
            {player?.strNationality && <p className="player-card__meta">{player.strNationality}</p>}
        </Link>
    )
}

export default PlayerCard