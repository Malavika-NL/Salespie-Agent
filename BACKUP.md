# SalesPie PostgreSQL Backups

The live Docker PostgreSQL database stays in place inside the `postgres_data` volume.
These backup scripts only copy data out of it. They do not delete or move the live database.

## Manual backup on the server

From the project root:

```bash
bash scripts/backup-postgres.sh
```

This creates a compressed backup in `backups/` like:

```text
backups/salespie_postgres_2026-06-04_16-30-00.sql.gz
```

## Install weekly automatic backup on a Linux host

From the project root:

```bash
bash scripts/install-weekly-backup-cron.sh
```

Default schedule:

- every Sunday
- at 2:00 AM server time

## Change the schedule

Example: every day at 1:30 AM

```bash
CRON_SCHEDULE="30 1 * * *" bash scripts/install-weekly-backup-cron.sh
```

Example: every Wednesday at 11:45 PM

```bash
CRON_SCHEDULE="45 23 * * 3" bash scripts/install-weekly-backup-cron.sh
```

## Retention

By default, backups older than 90 days are deleted.

To keep 180 days instead:

```bash
BACKUP_RETENTION_DAYS=180 bash scripts/backup-postgres.sh
```

Or when installing cron:

```bash
BACKUP_RETENTION_DAYS=180 bash scripts/install-weekly-backup-cron.sh
```

## Windows manual backup

From PowerShell in the project root:

```powershell
.\scripts\backup-postgres.ps1
```

## Windows daily automatic backup

From PowerShell in the project root:

```powershell
.\scripts\install-daily-backup-task.ps1
```

Default schedule:

- every day
- at 6:00 PM

To choose another time:

```powershell
.\scripts\install-daily-backup-task.ps1 -Time "23:30"
```

Backups are saved in:

```text
backups/
```
