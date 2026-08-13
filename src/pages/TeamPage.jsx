import { useParams } from "react-router-dom";
import { useState } from "react";
import { buildTeamLookupUrl } from "../api/endpoints";
import { useSportsDbFetch } from "../hooks/useSportsDbFetch";
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import TeamTabs from '../components/team/TeamTabs';
import TeamOverviewTab from '../components/team/TeamOverviewTab';
import TeamRosterTab from '../components/team/TeamRosterTab';
import TeamScheduleTab from '../components/team/TeamScheduleTab';

function TeamPage() {
    const { id } = useParams();
    const teamResult = useSportsDbFetch(() => buildTeamLookupUrl(id), [id]);

    const [activeTab, setActiveTab] = useState("overview");

    if (teamResult.status === "loading" || teamResult.status === "idle") {
        return <Spinner />
    };
    if (teamResult.status === "error") {
        return <EmptyState message="Couldn't load team." />
    };

    const team = teamResult.data?.teams?.[0];

    if (!team) {
        return <EmptyState message="Team not found."/>
    };

    return (
        <>
            <TeamTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "overview" && (
                <TeamOverviewTab team={team} />
            )}
            {activeTab === "roster" && (
                <TeamRosterTab teamId={id} />
            )}
            {activeTab === "schedule" && (
                <TeamScheduleTab teamId={id} />
            )}
        </>
    )
}

export default TeamPage