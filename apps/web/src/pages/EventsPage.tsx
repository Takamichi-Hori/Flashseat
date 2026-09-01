import { useEffect, useState } from "react";

export async function getEvents() {

    const response = await api<{ events: Event[] }>("/api/events");

    return response.events;
}

const [ events, setEvents ] = useState<Event[]>([]);

useEffect(() => {

    getEvents().then(setEvents);
}, []);

{events.map(event => (

    <link
        key={event.id}
        to={`/events/${event.id}`}
    >
        <h2>{event.title}</h2>

        <p>{event.venue}</p>

        <p>
            {event.availableTickets}
            {" tickets left"}
        </p>

        </link>
))}