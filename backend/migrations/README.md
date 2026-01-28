# Database migrations

This repo calls Postgres tables directly (no ORM). If you see errors like:

- `relasi "users" tidak ada`

it means the tables were never created in your Postgres database.

## Minimal auth tables

Run: `001_init_auth.sql` to create:

- `users`
- `token_blacklist`

## How to run (Windows)

### Option A: pgAdmin (easiest)

1. Open pgAdmin
2. Pick your database (same as `DB_NAME` in `.env`)
3. Open Query Tool
4. Paste the SQL from `001_init_auth.sql` and execute

### Option B: psql (CLI)

If you have `psql` installed:

```powershell
cd C:\smartSchool_bcknd
psql -h <DB_HOST> -p <DB_PORT> -U <DB_USER> -d <DB_NAME> -f backend\migrations\001_init_auth.sql
```

Then restart the server.
