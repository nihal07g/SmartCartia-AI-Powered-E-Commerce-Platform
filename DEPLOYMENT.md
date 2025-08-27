# 🚀 SmartCartia Deployment Guide

This guide covers deployment options for the SmartCartia AI-Powered E-Commerce Platform.

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 16+
- npm or pnpm package manager
- LLM API key (OpenAI, Anthropic, etc.)

## 🏗️ Production Build Setup

### 1. Environment Configuration

Create a production `.env.local` file:

```env
# Production Environment
NODE_ENV=production

# Server Configuration
FRONTEND_PORT=3000
BACKEND_PORT=3001
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com

# Database Configuration (Production)
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=smartcartia_production
DB_USER=smartcartia_user
DB_PASSWORD=your-secure-password
DB_SSL=true

# AI Configuration
LLM_API_KEY=your-production-llm-key
LLM_MODEL=gpt-4-turbo-preview

# Security
JWT_SECRET=your-super-secure-jwt-secret-minimum-64-characters
BCRYPT_ROUNDS=14
```

### 2. Database Setup

```sql
-- Production database setup
CREATE DATABASE smartcartia_production;
CREATE USER smartcartia_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE smartcartia_production TO smartcartia_user;

-- Enable required extensions
\c smartcartia_production;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

```bash
# Run production migrations
psql -h your-db-host -U smartcartia_user -d smartcartia_production -f db/migrations/001_create_tables.sql

# Seed production data
psql -h your-db-host -U smartcartia_user -d smartcartia_production -f seeds/001_initial_data.sql
```

### 3. Build and Start

```bash
# Install production dependencies
npm ci --production

# Build the application
npm run build

# Start production servers
npm start
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Dependencies stage
FROM base AS dependencies
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS build
COPY . .
RUN npm ci
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

# Copy built application
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S smartcartia -u 1001
USER smartcartia

# Expose ports
EXPOSE 3000 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start the application
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  smartcartia:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_NAME=smartcartia_db
      - DB_USER=smartcartia_user
      - DB_PASSWORD=smartcartia_password
    depends_on:
      - postgres
      - redis
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped
    networks:
      - smartcartia-network

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=smartcartia_db
      - POSTGRES_USER=smartcartia_user
      - POSTGRES_PASSWORD=smartcartia_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - smartcartia-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - smartcartia-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - smartcartia
    restart: unless-stopped
    networks:
      - smartcartia-network

volumes:
  postgres_data:
  redis_data:

networks:
  smartcartia-network:
    driver: bridge
```

### Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f smartcartia

# Scale the application
docker-compose up -d --scale smartcartia=3
```

## ☁️ Cloud Deployment Options

### 1. Vercel (Frontend) + Railway (Backend)

#### Vercel Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

#### Railway Setup
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy backend
railway login
railway init
railway up
```

### 2. AWS ECS Deployment

#### ECS Task Definition
```json
{
  "family": "smartcartia-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "smartcartia",
      "image": "your-account.dkr.ecr.region.amazonaws.com/smartcartia:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        },
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:smartcartia/db-password"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/smartcartia",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 3. DigitalOcean App Platform

#### app.yaml
```yaml
name: smartcartia
services:
- name: smartcartia-app
  source_dir: /
  github:
    repo: nihal07g/SmartCartia-AI-Powered-E-Commerce-Platform
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 2
  instance_size_slug: basic-xxs
  http_port: 3000
  envs:
  - key: NODE_ENV
    value: production
  - key: DB_HOST
    type: SECRET
    value: DB_HOST
  - key: LLM_API_KEY
    type: SECRET
    value: LLM_API_KEY

databases:
- name: smartcartia-db
  engine: PG
  version: "16"
  size: db-s-1vcpu-1gb
```

### 4. Heroku Deployment

#### Procfile
```
web: npm start
release: npm run db:migrate
```

#### Deploy Commands
```bash
# Install Heroku CLI
npm install -g heroku

# Create app
heroku create smartcartia-production

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set LLM_API_KEY=your-api-key

# Deploy
git push heroku main
```

## 🔧 Nginx Configuration

### nginx.conf
```nginx
upstream smartcartia_frontend {
    server localhost:3000;
}

upstream smartcartia_backend {
    server localhost:3001;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    # Frontend
    location / {
        proxy_pass http://smartcartia_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://smartcartia_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # API specific headers
        proxy_set_header Authorization $http_authorization;
        proxy_pass_header Authorization;
    }

    # Static assets
    location /uploads/ {
        root /app;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self'" always;
}
```

## 📊 Monitoring & Logging

### Application Monitoring

#### PM2 Configuration (pm2.config.js)
```javascript
module.exports = {
  apps: [
    {
      name: 'smartcartia-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run preview -- --port 3000',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'smartcartia-backend',
      script: './server/index.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
```

#### Start with PM2
```bash
# Install PM2
npm install -g pm2

# Start applications
pm2 start pm2.config.js

# Monitor
pm2 monit

# View logs
pm2 logs

# Restart
pm2 restart all
```

### Database Monitoring

#### PostgreSQL Performance
```sql
-- Monitor active connections
SELECT count(*) FROM pg_stat_activity;

-- Check slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Index usage
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE tablename = 'products';
```

## 🔒 Security Best Practices

### Production Security Checklist

- [ ] Enable HTTPS with valid SSL certificates
- [ ] Set secure environment variables
- [ ] Configure CORS for production domains
- [ ] Enable database SSL connections
- [ ] Set up rate limiting
- [ ] Configure security headers
- [ ] Enable audit logging
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Enable monitoring and alerting

### Database Security
```sql
-- Create read-only user for analytics
CREATE USER analytics_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE smartcartia_production TO analytics_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_user;

-- Enable row-level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

## 📈 Performance Optimization

### Database Optimization
```sql
-- Create indexes for common queries
CREATE INDEX CONCURRENTLY idx_products_category ON products(category_id);
CREATE INDEX CONCURRENTLY idx_products_price ON products(price);
CREATE INDEX CONCURRENTLY idx_orders_user ON orders(user_id);
CREATE INDEX CONCURRENTLY idx_reviews_product ON reviews(product_id);

-- Analyze tables
ANALYZE products;
ANALYZE orders;
ANALYZE users;
```

### Application Optimization
```bash
# Enable compression
export NODE_OPTIONS="--enable-source-maps"

# Set memory limits
export NODE_OPTIONS="--max-old-space-size=2048"

# Enable clustering
export NODE_ENV=production
export CLUSTER_WORKERS=4
```

## 🚀 Deployment Scripts

### deployment.sh
```bash
#!/bin/bash

# Production deployment script
set -e

echo "🚀 Starting SmartCartia deployment..."

# Pull latest code
git pull origin main

# Install dependencies
npm ci --production

# Run database migrations
npm run db:migrate

# Build application
npm run build

# Restart services
pm2 restart all

# Run health check
sleep 10
curl -f http://localhost:3001/api/health || exit 1

echo "✅ Deployment completed successfully!"
```

### Health Check Script
```bash
#!/bin/bash

# health-check.sh
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:3001/api/health"

# Check frontend
if curl -f $FRONTEND_URL > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is down"
    exit 1
fi

# Check backend
if curl -f $BACKEND_URL > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is down"
    exit 1
fi

echo "🎉 All services are healthy!"
```

## 📞 Support

For deployment issues:
- Check logs: `docker-compose logs` or `pm2 logs`
- Database connectivity: `psql -h host -U user -d database`
- API health: `curl http://localhost:3001/api/health`

For production support, please open an issue on GitHub or contact the development team.