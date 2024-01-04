FROM node:18-alpine as builder
WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm cache clean --force
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine as application
WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/package-lock.json .
COPY --from=builder /usr/src/app/*.pem ./dist
RUN npm cache clean --force
RUN npm ci --only=production

USER node
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/main"]