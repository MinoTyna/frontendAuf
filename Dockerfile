# 1) Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# copier le reste du projet
COPY . .

# build Next.js
RUN npm run build


# 2) Production stage (léger)
FROM node:18-alpine
WORKDIR /app

# copier package.json pour installer prod deps
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# copier les fichiers nécessaires pour exécuter Next.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./server.js

# si tu as un dossier "next.config.js"
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

CMD ["npm", "start"]
