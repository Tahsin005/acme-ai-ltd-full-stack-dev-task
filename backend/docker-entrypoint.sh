#!/bin/sh
set -e

echo "Waiting for database to be ready and running migrations..."
max_retries=15
count=0
until npm run db:migrate || [ $count -eq $max_retries ]; do
  count=$((count + 1))
  echo "Migration failed or database not ready yet. Retrying in 2 seconds... ($count/$max_retries)"
  sleep 2
done

if [ $count -eq $max_retries ]; then
  echo "Database migration failed after $max_retries attempts. Exiting."
  exit 1
fi

echo ""
echo "Database migrations applied successfully!"
echo "Starting backend..."
exec "$@"
