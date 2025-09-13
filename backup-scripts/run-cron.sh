#!/bin/bash

echo "Starting PostgreSQL backup cron job..."

# Export env
export POSTGRES_USER=${POSTGRES_USER:-postgres}
export POSTGRES_DB=${POSTGRES_DB:-postgres}
export POSTGRES_HOST=${POSTGRES_HOST:-postgres_db}
export PGPASSWORD=${POSTGRES_PASSWORD:-postgres}

# Create cron folder
mkdir -p /var/spool/cron/crontabs
touch /var/spool/cron/crontabs/root
chmod 600 /var/spool/cron/crontabs/root

# Cron: backup every hour
echo "* * * * * export PGPASSWORD=$PGPASSWORD && pg_dump -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB > /backups/backup-\$(date +\%F-%H%M%S).sql && rclone copy /backups/backup-\$(date +\%F-%H%M%S).sql gdrive:/TimelyClassBackups --progress && find /backups -type f -mtime +5 -delete" > /var/spool/cron/crontabs/root

# Run first backup immediately
BACKUP_FILE="/backups/backup-$(date +%F-%H%M%S).sql"
pg_dump -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB > $BACKUP_FILE
rclone copy $BACKUP_FILE gdrive:/TimelyClassBackups --progress

# Start cron
crond -f -l 8
