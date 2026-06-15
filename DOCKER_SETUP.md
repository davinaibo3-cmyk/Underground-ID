# Docker Setup Guide 🐳

## Prerequisites
- Docker Desktop
- Git
- 8GB RAM
- 5GB disk

## Quick Start

### 1. Clone
```bash
git clone https://github.com/davinaibo3-cmyk/underground-id.git
cd underground-id
```

### 2. Create .env
```bash
cp backend/.env.example backend/.env
```

### 3. Start Services
```bash
docker-compose up -d
```

### 4. Test
```bash
curl http://localhost:5000/api/health
```

## Services
- PostgreSQL: port 5432
- Backend: port 5000
- Redis: port 6379

## Common Commands
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f backend

# Restart
docker-compose restart postgres
```

## Troubleshooting
- Port in use: `lsof -ti:5000 | xargs kill -9`
- DB error: `docker-compose restart postgres`
- Memory: Increase Docker Desktop RAM

**Need help?** Check logs: `docker-compose logs -f`
