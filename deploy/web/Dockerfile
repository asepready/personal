# Build stage — Node on Alpine (only if you build inside container)
# Jika build di host (npm run build), cukup stage nginx saja.
FROM node:20-alpine AS builder
WORKDIR /app
COPY web/package*.json ./
RUN npm ci
COPY web/ .
RUN npm run build

# Runtime stage — Nginx on Alpine
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# SPA fallback; proxy /api ke backend saat satu network (container name: api)
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { try_files $uri $uri/ /index.html; } \
  location /api/ { proxy_pass http://api:8080/; proxy_http_version 1.1; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; } \
}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
