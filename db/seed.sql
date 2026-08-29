INSERT INTO events (
    title,
    venue,
    starts_at,
    price_yen,
    capacity
)
SELECT *
FROM (
    VALUES
      (
        'Neon Harbor Live',
        'Osaka Bay Hall',
        '2026-10-10T09:00:00Z'::timestamptz,
        6800,
        120
      ),
      (
        'Cloudline Sessions',
        'Kyoto Music Lab',
        '2026-10-24T08:30:00Z'::timestamptz,
        5200,
        80
      ),
      (
        'Midnight Circuit',
        'Kobe Harbor Studio',
        '2026-11-07T10:00:00Z'::timestamptz,
        7400,
        150
      )
) AS seed(
    title,
    venue,
    starts_at,
    price_yen,
    capacity
)
WHERE NOT EXISTS (
    SELECT 1 FROM events
);