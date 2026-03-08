# STAGE 1 - Compilation React + Vite
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# STAGE 2 - Production Nginx
FROM nginx:alpine
LABEL authors="AKIRA"
COPY --from=build /app/dist /usr/share/nginx/html
# Config pour éviter 404 sur refresh
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]