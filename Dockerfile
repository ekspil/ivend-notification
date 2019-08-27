FROM node:11
RUN mkdir -p /app/src
WORKDIR /app
COPY package-lock.json /app
COPY package.json /app
RUN npm install
COPY src /app/src
CMD ["node", "/app/src/app.js"]
