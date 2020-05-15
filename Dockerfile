FROM node:12.13-alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:12.13-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
LABEL traefik.backend=${CI_ENVIRONMENT_SLUG:-master} traefik.frontend.rule=Host:${CI_ENVIRONMENT_SLUG:-www}.api.phevoy.pl traefik.docker.network=traefik_net traefik.enable=true traefik.port=3000 traefik.default.protocol=http
