CREATE TABLE IF NOT EXSITS user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    firebase_uid TEXT NOT NULL UNIQUE,
    
    email TEXT NOT NULL,

    display_name TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,

    venue TEXT NOT NULL,

    starts_at TIMESTAMPTZ NOT NULL,

    price_yen INT NOT NULL,
      CHECK (price_yen >= 0),

    capacity INT NOT NULL,
      CHECK (capacity >= 0),

    reserved_count INT NOT NULL DEFAULT 0
      CHECK () (researved_count >= 0),

    image_key TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT reserved_not_over_capacity
      CHECK (reserved_count <= capacity)
);

CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
      REFERENCES users(id)
      ON DELETE CASCADE,

    event_id UUID NOT NULL
      REFERENCES events(id)
      ON DELETE CASCADE,

    quantity INT NOT NULL,
      CHECK (quantity BETWEEN 1 AND 10),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_starts_at
ON events(starts_at);

CREATE INDEX IF NOT EXISTS idx_reservations_user_id
ON reservations(user_id);

CREATE INDEX IF NOT EXISTS idx_reservations_event_id
ON reservation(event_id);