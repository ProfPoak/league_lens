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
    const panelId = `league-panel-${league.id}`;

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
    <div className="league-accordion-item">
      <button className="league-accordion-item__button" onClick={onToggle} aria-expanded={isOpen}>
        {league.name}
      </button>

      <Collapsible id={panelId} isOpen={isOpen}>
        {isOpen && (
          <div className="league-accordion-item__panel">
            <p className="api-item__note">
              API free tier will only return the first 10 teams of the league
            </p>
            
            <FilterInput value={filterText} onChange={setFilterText} />

            {teamsResult.isLoading && <Spinner />}
            {teamsResult.status === "error" && (
              <EmptyState message="Couldn't load teams." />
            )}
            {teamsResult.status === "success" && filteredTeams.length === 0 && (
              <EmptyState message="No teams match your filter." />
            )}

            <div className="team-list">
              {filteredTeams.map((team) => (
                <TeamListItem key={team.idTeam} team={team} />
              ))}
            </div>

            <LeagueSchedulePreview
              data={scheduleResult.data}
              status={scheduleResult.status}
            />
          </div>
        )}
      </Collapsible>
    </div>
  );
 }

export default LeagueAccordionItem