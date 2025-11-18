# ---------- BUILD ----------
FROM node:22.12.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---------- RUN ----------
FROM nginx:alpine
# Copia solo el contenido interno de la carpeta de build
COPY --from=build /app/dist/tu-proyecto-angular/ /usr/share/nginx/html/
# Reemplaza default.conf con SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
