#!/bin/bash

# Copy example config to real config
cp src/config/env.config.example.ts src/config/env.config.ts

# Install dependencies and build
npm ci && npm run build
