# Base image for building the frontend
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Pass build arguments to Vite
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_MP_PUBLIC_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_MP_PUBLIC_KEY=$VITE_MP_PUBLIC_KEY

RUN npm run build

# Final production image
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/data ./src/data
COPY server.js ./

EXPOSE 3000
CMD ["node", "server.js"]
