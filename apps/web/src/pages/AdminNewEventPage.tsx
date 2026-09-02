import { useState, type FormEvent } from "react";

export function AdminNewEventPage() {
    const [file, setFile] = useState<File | null>(null);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    return (
        <main>
            <h1>Create event</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Event image
                    <input type="file" accept="image/*"
                        onChange={event => setFile(event.currentTarget.files?.[0] ?? null)} />
                </label>
                <button type="submit" disabled={!file}>Create event</button>
            </form>
            <p>The event creation endpoint is not implemented yet.</p>
        </main>
    );
}
