FROM node:18-alpine
WORKDIR /app
COPY package.json auth-service.js ./
COPY public ./public
RUN npm install
CMD ["node", "auth-service.js"]
