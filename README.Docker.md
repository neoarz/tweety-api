# Docker Setup for Tweety API

This guide explains how to build and run the Tweety API using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)

## Quick Start

### Using Docker Compose (Recommended)

1. Build and start the container:
```bash
docker-compose up -d
```

2. View logs:
```bash
docker-compose logs -f
```

3. Stop the container:
```bash
docker-compose down
```

### Using Docker CLI

1. Build the Docker image:
```bash
docker build -t tweety-api .
```

2. Run the container:
```bash
docker run -p 3004:3000 --name tweety-api tweety-api
```

3. Run in detached mode (background):
```bash
docker run -d -p 3004:3000 --name tweety-api tweety-api
```

4. Stop the container:
```bash
docker stop tweety-api
```

5. Remove the container:
```bash
docker rm tweety-api
```

## Testing the API

Once the container is running, you can test the API:

```bash
curl -X POST http://localhost:3004/api/render \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "handle": "@johndoe",
    "text": "Hello from Docker! 🐳",
    "verified": true
  }'
```

Or open your browser to test with a GET request:
```
http://localhost:3004/api/render
```

## Environment Variables

You can pass environment variables to the container:

```bash
docker run -p 3004:3000 \
  -e NODE_ENV=production \
  --name tweety-api \
  tweety-api
```

## Troubleshooting

### View container logs:
```bash
docker logs tweety-api
```

### Access container shell:
```bash
docker exec -it tweety-api sh
```

### Rebuild without cache:
```bash
docker build --no-cache -t tweety-api .
```

## Production Deployment

For production, consider:
- Using a reverse proxy (nginx, traefik)
- Setting up health checks
- Implementing proper logging
- Using environment-specific configurations
- Setting up SSL/TLS certificates

## Notes

- The container runs internally on port 3000 but is exposed on port 3004 on your host machine
- The build uses multi-stage builds for optimal image size
- Next.js standalone output is enabled for minimal production builds
- If port 3004 is already in use, you can change it in `docker-compose.yml` (change `3004:3000` to `YOUR_PORT:3000`)
