import { pool } from "../db.js";


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
    
    return result.rows.map(row => ({
        
        id: row.id,
        title: row.title,
        venue: row.venue,
        startsAt: row.starts_at,
        priceYen: row.price_yen,
        capacity: row.capacity,
        reservation: row.reserved_count,
        availableTickets: row.capacity - row.reserved_count
    }));
}