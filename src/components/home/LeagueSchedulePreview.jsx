import EmptyState from '../common/EmptyState';
import { formatEventDateTime } from '../../utils/formatters';

function LeagueSchedulePreview ({ data, status }) {
    const events = data?.events ?? []

    return (
        <div>
            <h3>Next League Event:</h3>

            {status === "error" && (
                <EmptyState message="Could not load event" />
            )}
            {status === "success" && events.length === 0 && (
                <EmptyState message="No upcoming events" />
            )}

            <ul className="schedule-preview__list">
            {events.map((event) => (
                <li key={event.idEvent} className="schedule-preview__card">
                <p>{event.strEvent}</p>
                <p>{formatEventDateTime(event)}</p>
                </li>
            ))}
            </ul>

        </div>
    )
}

export default LeagueSchedulePreview