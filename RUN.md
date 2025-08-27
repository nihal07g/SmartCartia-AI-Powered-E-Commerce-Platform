# SmartCartia - Quick Start Guide

## Run Locally

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 16+ (for database features)

### Installation & Setup

1. **Install dependencies and start both servers:**

```bash
npm install
npm run dev
```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Environment Configuration

Create a `.env.local` file in the root directory with the following configuration:

```env
# Server Configuration
FRONTEND_PORT=3000
BACKEND_PORT=3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartcartia_db
DB_USER=smartcartia_user
DB_PASSWORD=smartcartia_password

# Large Language Model Configuration
LLM_API_KEY=your_llm_api_key_here
LLM_MODEL=advanced-llm-model

# Development Tools
PYTHON_EXECUTABLE=python
PYTHON_ML_PATH=./ml
NODE_ENV=development
```

## Database Setup (Optional)

For full database functionality:

```sql
-- Create PostgreSQL database
CREATE DATABASE smartcartia_db;
CREATE USER smartcartia_user WITH PASSWORD 'smartcartia_password';
GRANT ALL PRIVILEGES ON DATABASE smartcartia_db TO smartcartia_user;
```

```bash
# Run migrations
psql -U smartcartia_user -d smartcartia_db -f db/migrations/001_create_tables.sql

# Seed data
psql -U smartcartia_user -d smartcartia_db -f seeds/001_initial_data.sql
```

## API Testing

### PowerShell Commands

```powershell
# Test server health
Invoke-RestMethod -Method Get http://localhost:3001/api/health

# Test AI product finder
$body = '{"query":"budget wireless earbuds under 5000 rupees"}'
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/find-my-product -ContentType 'application/json' -Body $body

# Test product catalog
Invoke-RestMethod -Method Get http://localhost:3001/api/products
```

### Bash/cURL Commands

```bash
# Test server health
curl http://localhost:3001/api/health

# Test AI product recommendations
curl -X POST http://localhost:3001/api/find-my-product \
  -H "Content-Type: application/json" \
  -d '{"query":"budget wireless earbuds under 5000 rupees"}'

# Test product search
curl "http://localhost:3001/api/products?category=Electronics&limit=5"
```

## Architecture Notes

- **Frontend-Backend Communication**: All frontend requests route through the backend API at `http://localhost:3001/api/*`
- **AI Integration**: LLM API keys are server-side only for security
- **Database Fallback**: Application works with static data if database is not configured
- **Development Mode**: Hot reload enabled for both frontend and backend

## Available Scripts

```bash
npm run dev                 # Start both frontend and backend
npm run dev:frontend        # Frontend only (port 3000)
npm run dev:server          # Backend only (port 3001)
npm run build              # Production build
npm start                  # Production mode
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure LLM API keys
4. Run `npm run build && npm start`

For detailed setup instructions, see the main [README.md](README.md).