# HSTU Hall Manager — Deployment

Dockerized deployment for **https://hall-hstu.kernelbt.com**, mirroring the
`irt_ador` setup on the same host (dedicated Cloudflare named tunnel per app).

## Stack

| Service       | Container            | Description                                   |
| ------------- | -------------------- | --------------------------------------------- |
| `app`         | `hstu_hall_app`      | Laravel 13 + Inertia (React/TS) on PHP-FPM + Nginx (via Supervisor), also runs the queue worker and scheduler |
| `mysql`       | `hstu_hall_mysql`    | MySQL 8.4, seeded once from `hall-hstu-db-backup/Dump20260704.sql` |
| `cloudflared` | `hstu_hall_tunnel`   | Cloudflare tunnel — outbound-only ingress for the public hostname |

The app is also published on host port **8084** (`http://localhost:8084`) for
local verification. Public traffic arrives via the Cloudflare tunnel, not this
port.

## Image build

Multi-stage `Dockerfile`:

1. **base** — `php:8.3-fpm-alpine` + all runtime extensions + Composer.
2. **builder** — inherits `base`, adds Node; runs `composer install --no-dev`,
   `npm ci`, then `npm run build`. The build needs PHP because this app uses
   **Laravel Wayfinder**, whose Vite plugin shells out to
   `php artisan wayfinder:generate` during the build.
3. **production** — inherits `base`, copies `vendor/` + source + compiled
   `public/build`, sets permissions, and boots via `docker/entrypoint.sh`.

The entrypoint waits for MySQL, runs `migrate --force` (no-op against the
imported dump unless newer migrations exist), and caches config/routes/views.

## One-time setup: Cloudflare tunnel token

The only step that cannot be scripted from this host (no Cloudflare credentials
here). In the **Cloudflare Zero Trust dashboard → Networks → Tunnels**:

1. Create a named tunnel (e.g. `hstu-hall`).
2. Add a **Public Hostname**: `hall-hstu.kernelbt.com` → service
   `http://app:80`.
3. Copy the tunnel **token** and paste it into `.env` as `TUNNEL_TOKEN=...`
   (replacing `REPLACE_WITH_HALL_HSTU_TUNNEL_TOKEN`).

DNS for `hall-hstu.kernelbt.com` is created automatically by the tunnel's
public-hostname config (a CNAME to the tunnel).

## Deploy

```bash
cd /home/ubuntu/projects/HSTU_Hall_manager

# First build + start everything (MySQL imports the dump on first boot)
docker compose up -d --build

# Watch logs
docker compose logs -f app
docker compose logs -f cloudflared
```

Verify locally:

```bash
curl -I http://localhost:8084/up      # Laravel health check -> 200
curl -I http://localhost:8084/        # app home
```

Once the tunnel token is set and the tunnel is healthy, the app is live at
https://hall-hstu.kernelbt.com.

## Updating the app

```bash
git pull
docker compose up -d --build app
```

## Notes

- `.env` holds secrets (app key, DB passwords, tunnel token) and is git-ignored.
- The MySQL dump is imported **only on first boot** (empty data dir). To
  re-import, `docker compose down -v` (this deletes the DB volume) then
  `docker compose up -d`.
- App storage persists in the `app_storage` named volume; DB data in
  `mysql_data`.
