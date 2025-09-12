
#!/bin/bash

# Kong Admin URL
KONG_ADMIN="http://localhost:8001"

# --- SERVICES ---
echo "Registering services..."

# Users Service
curl -i -X POST $KONG_ADMIN/services/ \
  --data "name=users-service" \
  --data "url=http://host.docker.internal:5001"

# Schedule Service
curl -i -X POST $KONG_ADMIN/services/ \
  --data "name=schedule-service" \
  --data "url=http://host.docker.internal:5002"

echo "Services registered!"
echo "---------------------"

# --- ROUTES ---
echo "Registering routes..."

# Users route
curl -i -X POST $KONG_ADMIN/services/users-service/routes \
  --data "paths[]=/api/v1/users" \
  --data "strip_path=false"

# Schedule route
curl -i -X POST $KONG_ADMIN/services/schedule-service/routes \
  --data "paths[]=/api/v1/schedules" \
  --data "strip_path=false"

echo "Routes registered!"
echo "---------------------"

# --- OPTIONAL: Add Plugins ---
# Example: Enable rate-limiting for users-service
# curl -i -X POST $KONG_ADMIN/services/users-service/plugins \
#   --data "name=rate-limiting" \
#   --data "config.minute=10" \
#   --data "config.policy=local"

echo "Kong setup completed successfully!"
