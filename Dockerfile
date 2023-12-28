FROM node:18-alpine as builder

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force
COPY ./src ./src
COPY tsconfig.json .
RUN npm run build

FROM node:18-alpine as application
WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=3000
ENV PORT=$PORT

COPY --from=builder /usr/src/app/dist ./dist

USER node
EXPOSE $PORT
CMD ["node", "dist/main.js"]