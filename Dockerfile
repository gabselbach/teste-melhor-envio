FROM node:19.5.0-alpine
 
WORKDIR /home/node/app

RUN npm i -g @nestjs/cli

COPY package*.json ./

RUN npm install

COPY . .
 
RUN npm run build
 
USER node
 
CMD ["npm", "run", "start:dev"]