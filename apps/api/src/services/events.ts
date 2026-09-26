import { pool } from "../db.js";
import { createDownloadUrl } from "../s3.js";

export async function listEvents() {
  const result = await pool.query(`
    SELECT
      id,
      title,
      venue,
      starts_at,
      price_yen,
      capacity,
      reserved_count,
      image_key
    FROM events
    ORDER BY starts_at ASC
  `);

  return Promise.all(
    result.rows.map(async row => ({
      id: row.id,
      title: row.title,
      venue: row.venue,
      startsAt: row.starts_at,
      priceYen: row.price_yen,
      capacity: row.capacity,
      reservation: row.reserved_count,
      availableTickets:
        row.capacity - row.reserved_count,
      imageKey: row.image_key,
      imageUrl: row.image_key
        ? await createDownloadUrl(row.image_key)
        : null
    }))
  );
}

export async function getEvent(id: string) {
  const result = await pool.query(
    `
    SELECT
      id,
      title,
      venue,
      starts_at,
      price_yen,
      capacity,
      reserved_count,
      image_key
    FROM events
    WHERE id = $1
    `,
    [id]
  );

  if (!result.rowCount) {
    throw new Error("event_not_found");
  }

  const row = result.rows[0];

  return {
    id: row.id,
    title: row.title,
    venue: row.venue,
    startsAt: row.starts_at,
    priceYen: row.price_yen,
    capacity: row.capacity,
    reservation: row.reserved_count,
    availableTickets:
      row.capacity - row.reserved_count,
    imageKey: row.image_key,
    imageUrl: row.image_key
      ? await createDownloadUrl(row.image_key)
      : null
  };
}

export type NewEvent = {
  title: string;
  venue: string;
  startsAt: string;
  priceYen: number;
  capacity: number;
  imageKey?: string;
};

export async function createEvent(event: NewEvent) {
  const result = await pool.query(
    `
    INSERT INTO events (
      title,
      venue,
      starts_at,
      price_yen,
      capacity,
      image_key
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      title,
      venue,
      starts_at,
      price_yen,
      capacity,
      reserved_count,
      image_key
    `,
    [
      event.title,
      event.venue,
      event.startsAt,
      event.priceYen,
      event.capacity,
      event.imageKey ?? null
    ]
  );

  const row = result.rows[0];

  return {
    id: row.id,
    title: row.title,
    venue: row.venue,
    startsAt: row.starts_at,
    priceYen: row.price_yen,
    capacity: row.capacity,
    reservation: row.reserved_count,
    availableTickets:
      row.capacity - row.reserved_count,
    imageKey: row.image_key,
    imageUrl: row.image_key
      ? await createDownloadUrl(row.image_key)
      : null
  };
}