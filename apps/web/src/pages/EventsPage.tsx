import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents, type EventDetails } from "../api";

export function EventsPage() {
    const [events, setEvents] = useState<EventDetails[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        void getEvents()
            .then(events => { if (active) setEvents(events); })
            .catch(error => {
                if (active) setError(error instanceof Error ? error.message : "Failed to load events");
            });
        return () => { active = false; };
    }, []);

    return (
        <main>
            <h1>Events</h1>
            {error ? <p role="alert">{error}</p> : null}
            <div>
                {events.map(event => (
                    <Link key={event.id} to={`/events/${event.id}`}>
                        <article>
                            <h2>{event.title}</h2>
                            <p>{event.venue}</p>
                            <p>{event.availableTickets} tickets left</p>
                        </article>
                    </Link>
                ))}
            </div>
        </main>
    );
}
