import { Link } from "react-router-dom"

function PlayerHeader({ player }) {
    
    return(
        <div className="player-header">
            {(player.strCutout || player.strThumb) && (
                <img className="player-header__photo" src={player.strCutout || player.strThumb} alt={`${player.strPlayer}`} />
            )}
            <div className="player-header__info">
                <h1 className="player-header__name">{player.strPlayer}</h1>

                {player.strTeam && player.idTeam && (
                    <Link className="player-header__team" to={`/team/${player.idTeam}`}>{player.strTeam}</Link>
                )}

                <div className="player-header__meta">
                    {player.strPosition && (
                        <span className="player-header__badge">{player.strPosition}</span>
                    )}

                    {player.strNumber && (
                        <span className="player-header__badge player-header__badge--number">#{player.strNumber}</span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PlayerHeader