FROM node:17-alpine3.14
WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
RUN npm install -g nodemon
COPY . .

CMD ["npm", "start"]