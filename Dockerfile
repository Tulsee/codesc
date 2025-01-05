# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .


# Stage 2: Production stage
FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /app ./

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeuser
RUN chown -R nodeuser:nodejs /app
USER nodeuser

EXPOSE 8000

CMD ["yarn", "start"]