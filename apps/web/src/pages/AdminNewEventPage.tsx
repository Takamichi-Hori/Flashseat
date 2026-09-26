import { useState, type FormEvent } from "react";

import {
  createEvent,
  getUploadUrl,
  uploadImage
} from "../api";

import {
  getToken,
  signInWithGoogle
} from "../firebase";

export function AdminNewEventPage() {
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [priceYen, setPriceYen] = useState(0);
  const [capacity, setCapacity] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setMessage("Creating event...");

      let token = await getToken();

      if (!token) {
        const user = await signInWithGoogle();
        token = await user.getIdToken();
      }

      let imageKey: string | undefined;

      if (file) {
        if (
          file.type !== "image/jpeg" &&
          file.type !== "image/png" &&
          file.type !== "image/webp"
        ) {
          throw new Error(
            "Only JPEG, PNG and WebP images are supported."
          );
        }

        const presign =
          await getUploadUrl(file.type, token);

        await uploadImage(
          presign.uploadUrl,
          file
        );

        imageKey = presign.imageKey;
      }

      await createEvent(
        {
          title,
          venue,
          startsAt:
            new Date(startsAt).toISOString(),
          priceYen,
          capacity,
          imageKey
        },
        token
      );

      setMessage("Event created successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to create event."
      );
    }
  }

  return (
    <main>
      <h1>Create event</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>

        <label>
          Venue
          <input
            required
            value={venue}
            onChange={e => setVenue(e.target.value)}
          />
        </label>

        <label>
          Date
          <input
            required
            type="datetime-local"
            value={startsAt}
            onChange={e => setStartsAt(e.target.value)}
          />
        </label>

        <label>
          Price (JPY)
          <input
            required
            type="number"
            min="0"
            value={priceYen}
            onChange={e =>
              setPriceYen(
                Number(e.target.value)
              )
            }
          />
        </label>

        <label>
          Capacity
          <input
            required
            type="number"
            min="1"
            value={capacity}
            onChange={e =>
              setCapacity(
                Number(e.target.value)
              )
            }
          />
        </label>

        <label>
          Event image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={e =>
              setFile(
                e.target.files?.[0] ?? null
              )
            }
          />
        </label>

        <button type="submit">
          Create event
        </button>
      </form>

      {message && (
        <p role="status">{message}</p>
      )}
    </main>
  );
}