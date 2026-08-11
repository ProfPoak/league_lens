
export function formatEventDateTime(event) {
    if (!event?.dateEvent) return null;

    const isoString = event.strTimestamp
        ? `${event.strTimestamp.replace(" ", "T")}Z`
        : `${event.dateEvent}T${event.strTime ?? "00:00:00"}Z`;

    const date = new Date(isoString);
    if (isNaN(date)) return null;

    return date.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}