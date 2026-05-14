# Base image for building the frontend
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Final production image
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist
COPY server.js ./
COPY .env ./

EXPOSE 3004
CMD ["node", "server.js"]
