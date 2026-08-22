import { useState } from "react"
import Collapsible from "../common/Collapsible"

function PlayerBio({ player }) {
    const [descriptionOpen, setDescriptionOpen] = useState(true)

    return(
        <div className="player-bio">
            {player.dateBorn && (
                <p>Born {player.dateBorn}</p>
            )}

            {player.strBirthLocation && (
                <p>{player.strBirthLocation}</p>
            )}

            {player.strNationality && (
                <p>{player.strNationality}</p>
            )}

            {(player.strHeight || player.strWeight) && (
                <p>{player.strHeight} {player.strWeight}</p>
            )}

            {player.strDescriptionEN && (
                <>
                    <button onClick={() => setDescriptionOpen(prev => !prev)}>{descriptionOpen ? "Hide" : "Show"} description</button>
                    <Collapsible isOpen={descriptionOpen}>
                        <p>{player.strDescriptionEN}</p>
                    </Collapsible>
                </>
            )}
        </div>
    )
}

export default PlayerBio