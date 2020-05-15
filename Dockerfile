FROM node:12.13-alpine AS builder
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:10-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./
CMD ["npm", "run", "start:prod"]
LABEL traefik.backend=${CI_ENVIRONMENT_SLUG:-master} traefik.frontend.rule=Host:${CI_ENVIRONMENT_SLUG:-www}.api.phevoy.pl traefik.docker.network=traefik_net traefik.enable=true traefik.port=3000 traefik.default.protocol=http
