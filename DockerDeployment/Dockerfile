FROM node:12-stretch-slim

USER node

WORKDIR /home/node/src

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "npm","start" ]