--PRAGMA defer_foreign_keys = on;
--
--BEGIN TRANSACTION;
--
--CREATE TABLE new_users (
--  id TEXT PRIMARY KEY,
--  email TEXT UNIQUE NOT NULL,
--  password_hash TEXT NOT NULL,
--  salt TEXT NOT NULL,
--  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--  gender TEXT CHECK(gender IN ('female', 'male')) DEFAULT 'female',
--  store INTEGER CHECK(store BETWEEN 0 AND 99) DEFAULT 9,
--  segment TEXT CHECK(
--    segment IN ('anonymous', 'lead', 'vip') OR 
--    (LENGTH(segment) <= 30 AND segment GLOB 'funnel_*')
--  ) DEFAULT 'lead'
--);
--
--INSERT INTO new_users 
--  (id, email, password_hash, salt, created_at)
--SELECT 
--  id, email, password_hash, salt, created_at 
--FROM users;
--
--DROP TABLE users;
--ALTER TABLE new_users RENAME TO users;
--
--COMMIT;
--
--PRAGMA defer_foreign_keys = off;

PRAGMA defer_foreign_keys = on;

CREATE TABLE new_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  gender TEXT CHECK(gender IN ('female', 'male')) DEFAULT 'female',
  store INTEGER CHECK(store BETWEEN 0 AND 99) DEFAULT 9,
  segment TEXT CHECK(
    segment IN ('anonymous', 'lead', 'vip') OR 
    (LENGTH(segment) <= 30 AND segment GLOB 'funnel_*')
  ) DEFAULT 'lead'
);

INSERT INTO new_users 
  (id, email, password_hash, salt, created_at)
SELECT 
  id, email, password_hash, salt, created_at 
FROM users;

DROP TABLE users;
ALTER TABLE new_users RENAME TO users;

PRAGMA defer_foreign_keys = off;

