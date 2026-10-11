FROM node:22-alpine

WORKDIR /app

# Dependências do backend (camada em cache)
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

# Código do backend e do frontend (o backend serve o frontend em ../frontend)
COPY backend ./backend
COPY frontend ./frontend

WORKDIR /app/backend

ENV NODE_ENV=production
EXPOSE 8000

USER node
CMD ["node", "server.js"]