const API_URL = import.meta.env.VITE_API_URL;

async function api<T>(
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