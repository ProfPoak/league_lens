import { useState } from "react";
import { LEAGUES } from "../../utils/leagues";
import LeagueAccordionItem from "./LeagueAccordionItem"

function LeagueAccordion() {
    const [activeLeagueId, setActiveLeagueId] = useState(null);

    const handleToggle = (LeagueId) => {
        setActiveLeagueId((current) => (current === LeagueId ? null : LeagueId))
    }

    return (
        <div>
            {LEAGUES.map((league) => (
                <LeagueAccordionItem
                key={league.id}
                league={league}
                isOpen={league.id === activeLeagueId}
                onToggle={() => handleToggle(league.id)}
                />
            ))}
        </div>
    )
}

export default LeagueAccordion