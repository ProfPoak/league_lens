import { useState } from "react"
import Collapsible from "../common/Collapsible"
import EmptyState from "../common/EmptyState"

function PlayerBio({ player }) {
    const [descriptionOpen, setDescriptionOpen] = useState(true)

    return(
        <div className="player-bio">
            <div className="player-bio__meta">
                {player.dateBorn && (
                    <p className="player-bio__field">Born {player.dateBorn}</p>
                )}

                {player.strBirthLocation && (
                    <p className="player-bio__field">{player.strBirthLocation}</p>
                )}

                {player.strNationality && (
                    <p className="player-bio__field">{player.strNationality}</p>
                )}

                {(player.strHeight || player.strWeight) && (
                    <p className="player-bio__field">{player.strHeight} {player.strWeight}</p>
                )}
            </div>

            {player.strDescriptionEN ? (
                <div className="player-bio__description">
                    <button className="player-bio__toggle" onClick={() => setDescriptionOpen(prev => !prev)}>
                        {descriptionOpen ? "Hide" : "Show"} description
                    </button>
                    <Collapsible isOpen={descriptionOpen}>
                        <p>{player.strDescriptionEN}</p>
                    </Collapsible>
                </div>
            ) : (
                <EmptyState message="No description available."/>
            )}
        </div>
    )
}


export default PlayerBio