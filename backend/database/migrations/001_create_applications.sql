CREATE TABLE applications(
    id UUID PRIMARY KEY,
    job_url TEXT NOT NULL,
    company TEXT,
    job_title TEXT,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);