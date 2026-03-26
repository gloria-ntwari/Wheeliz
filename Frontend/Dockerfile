FROM node:20-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# DEBUG
RUN ls -la /app/dist

FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# DEBUG
RUN ls -la /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]