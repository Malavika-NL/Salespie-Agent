#!/bin/sh
set -e

if [ "$DB_ENGINE" = "postgres" ]; then
  echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."
  until python - <<'PY'
import os
import psycopg2

host = os.getenv("DB_HOST", "db")
port = int(os.getenv("DB_PORT", "5432"))
user = os.getenv("DB_USER", "salespie")
password = os.getenv("DB_PASSWORD", "salespie123")
db = os.getenv("DB_NAME", "salescrm")

conn = psycopg2.connect(
    host=host,
    port=port,
    user=user,
    password=password,
    dbname=db,
    connect_timeout=3,
)
conn.close()
print("PostgreSQL is ready.")
PY
  do
    sleep 2
  done
fi

python manage.py migrate
python manage.py shell -c "import init_app; init_app.seed_default_user()"
python manage.py runserver 0.0.0.0:8001
