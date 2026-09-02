const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function api<T>(
    path: string,
    options: RequestInit = {},
    token?: string | null
): Promise<T> {

    const headers = new Headers(options.headers);

    headers.set("Content-Type", "application/json");

    if (token) {

        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${path}`,{...options, headers});

    const body = await response.json();

    if (!response.ok) {

        throw new Error(
            body.message || body.error
        );
    }

    return body;
}

export type EventDetails = {
    id: string;
    title: string;
    venue: string;
    startsAt: string;
    priceYen: number;
    capacity: number;
    availableTickets: number;
};

export async function getEvents() {
    const response = await api<{ events: EventDetails[] }>("/api/events");
    return response.events;
}

export async function getEvent(id: string) {
    const response = await api<{ event: EventDetails }>(`/api/events/${id}`);
    return response.event;
}

export function reserve(eventId: string, quantity: number, token: string) {
    return api<{ reservation: { id: string } }>(
        `/api/reservations/events/${eventId}`,
        { method: "POST", body: JSON.stringify({ quantity }) },
        token
    );
}
