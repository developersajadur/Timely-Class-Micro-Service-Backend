#!/bin/bash

# Variables
USERNAME="sajadurrahman"
PROJECT="timelyclass"

echo "🚀 Starting build and push process..."

# Build and Push Users Service
echo "📦 Building Users Service..."
docker build -t $USERNAME/$PROJECT-users-service:latest ./services/User
docker push $USERNAME/$PROJECT-users-service:latest
echo "✅ Users Service pushed successfully!"

# Build and Push Schedule Service
echo "📦 Building Schedule Service..."
docker build -t $USERNAME/$PROJECT-schedule-service:latest ./services/Schedule
docker push $USERNAME/$PROJECT-schedule-service:latest
echo "✅ Schedule Service pushed successfully!"

echo "🎉 All services built and pushed successfully!"
