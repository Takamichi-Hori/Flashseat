import { pool } from "../db.js";
import { assertCanReserve } from "../domain/inventory.js";

export async function createRservation(
    eventId: string,
    quantity: number,
    user: {
        uid: string;
        email: string;
        name?: string;
    }
) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const eventResult = await client.query(`
        
            SELECT
              capacity,
              reserved_count
        
            FROM events
        
            WHERE id = $1
        
            FOR UPDATE
            `, [eventId]
        );

        if (!eventResult.rowCount) {
            throw new Error(
                "event_not_found"
            );
        }

        const event = eventResult.rows[0];

        assertCanReserve(
            event.capacity,
            event.reserved_count,
            quantity
        );

        const userResult = await client.query(`
            INSERT INTO users (
            firebase_uid,
            email,
            display_name
            )
            VALUES ($1, $2, $3)
            
            ON CONFLICT (firebase_uid)
            
            DO UPDATE SET
              email = EXCLUDED.email,
              display_name = EXCLUDED.display_name
              
            RETURNING id
            `,
            [
                user.uid,
                user.email,
                user.name ?? null
            ]
        );

        const userId = userResult.rows[0].id;

        const reservation = await client.query(`
            
            INSERT INTO reservations (
              user_id,
              event_id,
              quantity
              )
              VALUES ($1, $2, $3)
              
              RETURNING
                id,
                created_at
              `, [
                userId,
                eventId,
                quantity
              ]
            );

        await client.query(`
            
            UPDATE events
            
            SET reserved_count = reserved_count + $1
            
            WHERE id = $2
            `,[
                quantity,
                eventId
            ]
        );

        await client.query("COMMIT");

        return {
            id:
              reservation.rows[0].id,

            eventId,

            quantity,

            createdAt:
              reservation.rows[0]
                .created_at
        };
} catch (error) {
    
    await client.query("ROLLBACK");
    
    throw error;

} finally {
    client.release();
  }
} 