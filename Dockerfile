# ---------------------------
# Stage 1: Build
# ---------------------------
FROM node:20-slim AS builder

# Limite mémoire pour éviter les crash sur t3.micro
ENV NODE_OPTIONS="--max-old-space-size=512"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# ---------------------------
# Stage 2: Production
# ---------------------------
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Installer seulement les dépendances nécessaires en production
RUN npm install --production

EXPOSE 3000

CMD ["npx", "next", "start"]
