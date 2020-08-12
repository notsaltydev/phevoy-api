FROM node:12.13-alpine AS builder

WORKDIR /usr/src/app

RUN npm install pm2 -g

COPY ./package.json ./

RUN npm install

COPY . .

RUN npm run build

#CMD ["npm", "run", "start:prod"]
CMD ["pm2-runtime", "start", "npm", "--name", "phevoy-api", "--", "run", "start:prod"]

LABEL traefik.backend=${CI_ENVIRONMENT_SLUG:-master} traefik.frontend.rule=Host:${CI_ENVIRONMENT_SLUG:-www}.api.phevoy.pl traefik.docker.network=traefik_net traefik.enable=true traefik.port=3000 traefik.default.protocol=http
