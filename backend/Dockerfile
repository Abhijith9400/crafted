FROM node:22-alpine

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

EXPOSE 5000

ENV NODE_ENV=production

RUN npm run build

CMD ["npm", "start"]