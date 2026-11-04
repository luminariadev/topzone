FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.vercel /app/.vercel
COPY --from=builder /app/public /app/public

EXPOSE 4321

CMD ["npm", "run", "serve"]
