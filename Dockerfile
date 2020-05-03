FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
# If you are building your code for production
RUN npm ci --only=production
# Bundle app source
COPY . .
EXPOSE 8080
CMD [ "node", "index.js" ]
