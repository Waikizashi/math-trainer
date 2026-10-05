FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY . ./
RUN CI=false npm run build

FROM nginx:1.28-alpine
COPY nginx-forwarded.conf /etc/nginx/conf.d/00-forwarded.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
