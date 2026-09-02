import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEvent, reserve, type EventDetails } from "../api";
import { getToken, signInWithGoogle } from "../firebase";

export function EventDetailPage() {
    const { id = "" } = useParams();
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        void getEvent(id)
            .then(event => { if (active) setEvent(event); })
            .catch(error => {
                if (active) setMessage(error instanceof Error ? error.message : "Failed to load event");
            });
        return () => { active = false; };
    }, [id]);

    async function reserveTickets() {
        try {
            let token = await getToken();
            if (!token) {
                const user = await signInWithGoogle();
                token = await user.getIdToken();
            }
            await reserve(id, quantity, token);
            setMessage("Reservation completed.");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Reservation failed");
        }
    }

    if (!event) return <main><p role="status">{message ?? "Loading event…"}</p></main>;

    return (
        <main>
            <h1>{event.title}</h1>
            <p>{event.venue}</p>
            <p>{event.availableTickets} tickets left</p>
            <label>
                Quantity
                <input type="number" min={1} max={Math.min(10, event.availableTickets)} value={quantity}
                    onChange={event => setQuantity(event.currentTarget.valueAsNumber)} />
            </label>
            <button type="button" onClick={() => void reserveTickets()}>Reserve</button>
            {message ? <p role="status">{message}</p> : null}
        </main>
    );
}
