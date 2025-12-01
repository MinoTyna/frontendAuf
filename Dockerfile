# ---------------------------
# Stage 1: Build
# ---------------------------
FROM node:20-alpine AS builder

# Crée le répertoire de travail
WORKDIR /app

# Copie uniquement les fichiers package pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Build de l'application Next.js
RUN npm run build

# ---------------------------
# Stage 2: Production
# ---------------------------
FROM node:20-alpine

# Répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires à l'exécution
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Installer seulement les dépendances nécessaires en production
RUN npm install --production

# Exposer le port
EXPOSE 3000

# Commande pour démarrer le serveur Next.js
CMD ["npx", "next", "start"]
