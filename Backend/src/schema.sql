CREATE TABLE IF NOT EXISTS songs (
    id VARCHAR(255) PRIMARY KEY,
    lyrics TEXT NOT NULL,
    full_title VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    release_date VARCHAR(255),
    song_art TEXT,
    artists TEXT NOT NULL,
    all_artists TEXT[],
    analysed_lyrics JSONB,
    visits INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 

