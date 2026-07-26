#!/bin/sh
set -e

echo "=========================================="
echo "  HSTU Hall Manager - Starting Up..."
echo "=========================================="

# Set system timezone if TZ is provided
if [ -n "$TZ" ] && [ -f "/usr/share/zoneinfo/$TZ" ]; then
    echo "[entrypoint] Setting system timezone to $TZ..."
    ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime
    echo "$TZ" > /etc/timezone
fi

# Create .env file from environment variables if it doesn't exist
if [ ! -f /var/www/html/.env ]; then
    echo "[entrypoint] Creating .env file from environment variables..."
    cat > /var/www/html/.env << EOF
APP_NAME="${APP_NAME:-HSTU Hall Manager}"
APP_ENV=${APP_ENV:-production}
APP_KEY=${APP_KEY:-}
APP_DEBUG=${APP_DEBUG:-false}
APP_URL=${APP_URL:-http://localhost}
APP_TIMEZONE=${APP_TIMEZONE:-UTC}

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=${DB_CONNECTION:-mysql}
DB_HOST=${DB_HOST:-mysql}
DB_PORT=${DB_PORT:-3306}
DB_DATABASE=${DB_DATABASE:-hall_manager_hstu}
DB_USERNAME=${DB_USERNAME:-hall_user}
DB_PASSWORD=${DB_PASSWORD:-hall_secret_password}

SESSION_DRIVER=${SESSION_DRIVER:-database}
SESSION_LIFETIME=${SESSION_LIFETIME:-120}
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=${BROADCAST_CONNECTION:-log}
FILESYSTEM_DISK=${FILESYSTEM_DISK:-local}
QUEUE_CONNECTION=${QUEUE_CONNECTION:-database}

CACHE_STORE=${CACHE_STORE:-database}

MAIL_MAILER=${MAIL_MAILER:-log}
MAIL_HOST=${MAIL_HOST:-127.0.0.1}
MAIL_PORT=${MAIL_PORT:-2525}
MAIL_USERNAME=${MAIL_USERNAME:-null}
MAIL_PASSWORD=${MAIL_PASSWORD:-null}
MAIL_ENCRYPTION=${MAIL_ENCRYPTION:-null}
MAIL_FROM_ADDRESS="${MAIL_FROM_ADDRESS:-hello@example.com}"
MAIL_FROM_NAME="\${APP_NAME}"

TRUSTED_PROXIES=${TRUSTED_PROXIES:-*}

VITE_APP_NAME="\${APP_NAME}"
EOF
    chown www-data:www-data /var/www/html/.env
fi

# Generate app key if not set
if ! grep -q "^APP_KEY=base64:" /var/www/html/.env 2>/dev/null; then
    echo "[entrypoint] Generating application key..."
    php artisan key:generate --force
fi

# Wait for MySQL to be ready
echo "[entrypoint] Waiting for MySQL to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0
until php -r "
    try {
        new PDO(
            'mysql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT'),
            getenv('DB_USERNAME'),
            getenv('DB_PASSWORD')
        );
        echo 'connected';
        exit(0);
    } catch (Exception \$e) {
        exit(1);
    }
" 2>/dev/null || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
    echo "[entrypoint] MySQL not ready yet... retrying ($((RETRY_COUNT+1))/$MAX_RETRIES)"
    RETRY_COUNT=$((RETRY_COUNT+1))
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "[entrypoint] WARNING: MySQL may not be fully ready, proceeding anyway..."
fi

# Run database migrations. The imported SQL dump already contains the full
# schema and a populated `migrations` table, so this is normally a no-op and
# will only apply migrations added after the dump was taken. Existing data is
# never dropped or re-seeded here.
echo "[entrypoint] Running database migrations (if any pending)..."
php artisan migrate --force || echo "[entrypoint] WARNING: migrate failed (tables may already exist), continuing..."

# Cache configuration for performance
echo "[entrypoint] Caching configuration..."
php artisan config:cache || echo "[entrypoint] WARNING: config:cache failed, continuing..."
php artisan route:cache || echo "[entrypoint] WARNING: route:cache failed (duplicate route names?), continuing..."
php artisan view:cache || echo "[entrypoint] WARNING: view:cache failed, continuing..."

# Create storage link if not exists
php artisan storage:link 2>/dev/null || true

# Fix ownership of files created by root during entrypoint
# (artisan commands above run as root but PHP-FPM runs as www-data)
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

echo "=========================================="
echo "  Application is ready!"
echo "  URL: ${APP_URL:-http://localhost}"
echo "=========================================="

# Execute the main process (supervisord)
exec "$@"
