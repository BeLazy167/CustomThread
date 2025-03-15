#!/bin/bash

# This script helps troubleshoot Docker connectivity issues in the CustomThread application

# Define colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Get deployment environment
if [ -z "$1" ]; then
  DEPLOY_ENV="production"
else
  DEPLOY_ENV="$1"
fi

echo -e "${YELLOW}Checking deployment for environment: ${DEPLOY_ENV}${NC}"

# Container names
FRONTEND_CONTAINER="frontend-${DEPLOY_ENV}"
BACKEND_CONTAINER="backend-${DEPLOY_ENV}"
NETWORK_NAME="customthread-network-${DEPLOY_ENV}"

# Check if containers are running
echo -e "\n${YELLOW}Checking container status:${NC}"
FRONTEND_RUNNING=$(docker ps -q -f name=${FRONTEND_CONTAINER})
BACKEND_RUNNING=$(docker ps -q -f name=${BACKEND_CONTAINER})

if [ -z "$FRONTEND_RUNNING" ]; then
  echo -e "${RED}❌ Frontend container (${FRONTEND_CONTAINER}) is not running!${NC}"
else
  echo -e "${GREEN}✅ Frontend container is running${NC}"
fi

if [ -z "$BACKEND_RUNNING" ]; then
  echo -e "${RED}❌ Backend container (${BACKEND_CONTAINER}) is not running!${NC}"
else
  echo -e "${GREEN}✅ Backend container is running${NC}"
fi

# Check if network exists
echo -e "\n${YELLOW}Checking Docker network:${NC}"
NETWORK_EXISTS=$(docker network ls | grep ${NETWORK_NAME})
if [ -z "$NETWORK_EXISTS" ]; then
  echo -e "${RED}❌ Docker network ${NETWORK_NAME} does not exist!${NC}"
else
  echo -e "${GREEN}✅ Docker network ${NETWORK_NAME} exists${NC}"
  
  # Check if containers are connected to the network
  echo -e "\n${YELLOW}Checking network connections:${NC}"
  FRONTEND_CONNECTED=$(docker network inspect ${NETWORK_NAME} | grep ${FRONTEND_CONTAINER})
  BACKEND_CONNECTED=$(docker network inspect ${NETWORK_NAME} | grep ${BACKEND_CONTAINER})
  
  if [ -z "$FRONTEND_CONNECTED" ]; then
    echo -e "${RED}❌ Frontend container is not connected to the network!${NC}"
  else
    echo -e "${GREEN}✅ Frontend container is connected to the network${NC}"
  fi
  
  if [ -z "$BACKEND_CONNECTED" ]; then
    echo -e "${RED}❌ Backend container is not connected to the network!${NC}"
  else
    echo -e "${GREEN}✅ Backend container is connected to the network${NC}"
  fi
fi

# Check MongoDB connection
echo -e "\n${YELLOW}Checking MongoDB connection:${NC}"
MONGO_STATUS=$(docker logs ${BACKEND_CONTAINER} 2>&1 | grep "MongoDB Connected")
if [ -z "$MONGO_STATUS" ]; then
  echo -e "${RED}❌ MongoDB connection issue detected!${NC}"
  echo -e "${YELLOW}Recent logs:${NC}"
  docker logs ${BACKEND_CONTAINER} 2>&1 | grep -i mongo | tail -n 10
else
  echo -e "${GREEN}✅ MongoDB connection successful: ${MONGO_STATUS}${NC}"
fi

# Check if frontend can reach backend
echo -e "\n${YELLOW}Testing frontend-to-backend connectivity:${NC}"
if [ ! -z "$FRONTEND_RUNNING" ] && [ ! -z "$BACKEND_RUNNING" ]; then
  echo "Executing curl test from frontend container to backend container..."
  CURL_RESULT=$(docker exec ${FRONTEND_CONTAINER} curl -s -o /dev/null -w "%{http_code}" http://${BACKEND_CONTAINER}:3001/api/health 2>/dev/null || echo "failed")
  
  if [ "$CURL_RESULT" = "200" ]; then
    echo -e "${GREEN}✅ Frontend can successfully connect to backend API${NC}"
  else
    echo -e "${RED}❌ Frontend cannot connect to backend API (status: $CURL_RESULT)${NC}"
    echo -e "${YELLOW}Troubleshooting recommendations:${NC}"
    echo "1. Check that backend API is running on port 3001"
    echo "2. Verify both containers are on the same network"
    echo "3. Check firewall settings"
  fi
fi

echo -e "\n${YELLOW}Summary:${NC}"
echo "Frontend container: ${FRONTEND_CONTAINER}"
echo "Backend container: ${BACKEND_CONTAINER}"
echo "Docker network: ${NETWORK_NAME}"
echo -e "\nTo view container logs:"
echo "docker logs ${FRONTEND_CONTAINER}"
echo "docker logs ${BACKEND_CONTAINER}" 