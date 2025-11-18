# ---------- BUILD ----------
FROM node:22.12.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---------- RUN ----------
FROM nginx:alpine
COPY --from=build /app/dist/impostor-front/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
