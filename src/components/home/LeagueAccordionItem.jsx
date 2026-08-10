import { useState } from "react";
import Collapsible from '../common/Collapsible';
import EmptyState from '../common/EmptyState';
import FilterInput from '../common/FilterInput';
import Spinner from '../common/Spinner';
import TeamListItem from './TeamListItem';
import LeagueSchedulePreview from './LeagueSchedulePreview';
import { buildTeamsByLeagueUrl, buildLeagueScheduleUrl } from '../../api/endpoints';
import { useSportsDbFetch } from '../../hooks/useSportsDbFetch';
  

 function LeagueAccordionItem({ league, isOpen, onToggle}) {
    const [filterText, setFilterText] = useState("");

    const teamsResult = useSportsDbFetch(
        () => (isOpen ? buildTeamsByLeagueUrl(league.apiName) : null),
        [isOpen, league.apiName]
    );

    const scheduleResult = useSportsDbFetch(
        () => (isOpen ? buildLeagueScheduleUrl(league.id) : null),
        [isOpen, league.id]
    );

    const teams = teamsResult.data?.teams ?? [];

    const filteredTeams = teams.filter((team) =>
        team.strTeam.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
    <div>
      <button onClick={onToggle} aria-expanded={isOpen}>
        {league.name}
      </button>

      <Collapsible isOpen={isOpen}>
        {isOpen && (
          <>
            <FilterInput value={filterText} onChange={setFilterText} />

            {teamsResult.isLoading && <Spinner />}
            {teamsResult.status === "error" && (
              <EmptyState message="Couldn't load teams." />
            )}
            {teamsResult.status === "success" && filteredTeams.length === 0 && (
              <EmptyState message="No teams match your filter." />
            )}

            {filteredTeams.map((team) => (
              <TeamListItem key={team.idTeam} team={team} />
            ))}

            <LeagueSchedulePreview
              data={scheduleResult.data}
              status={scheduleResult.status}
            />
          </>
        )}
      </Collapsible>
    </div>
  );
 }

export default LeagueAccordionItem