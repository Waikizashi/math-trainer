-- Demo seeding is transactional, recorded once and never part of normal startup.
CREATE TABLE app_seed_history (
    name VARCHAR(100) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
