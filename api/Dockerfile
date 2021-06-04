FROM node:14.15

WORKDIR /app
COPY . .

RUN yarn


RUN chown node:node .
USER node
EXPOSE 3000
CMD [ "node", "app.js" ]