FROM node:20 AS builder
WORKDIR /src/app
COPY frontend/package*.json .
RUN npm ci
COPY ./frontend .
COPY shared /src/shared
RUN npm run build
RUN npm prune --production

FROM node:20
WORKDIR /src/app
COPY --from=builder /src/app/build build/
COPY --from=builder /src/app/node_modules node_modules/
COPY frontend/package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
