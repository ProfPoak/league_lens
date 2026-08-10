 
 function LeagueAccordionItem({ league, isOpen, onToggle}) {

    return(
        <div>
            <button onClick={onToggle} aria-expanded={isOpen}>
                {league.name}
            </button>
        </div>
    )
 }

 export default LeagueAccordionItem