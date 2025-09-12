#!/bin/bash
set -e

echo "🚀 Pulling latest images..."
docker pull sajadurrahman/timelyclass-users-service:latest
docker pull sajadurrahman/timelyclass-schedule-service:latest

echo "🛑 Stopping old containers..."
docker-compose -f docker-compose.yml down

echo "📦 Starting updated containers..."
docker-compose -f docker-compose.yml up -d

echo "✅ Deployment successful!"
