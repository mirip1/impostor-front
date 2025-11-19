# ---------- BUILD ----------
FROM node:22.12.0 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install
COPY . .
RUN ng build --configuration production
# Verificar que se usó la configuración de producción
RUN grep -q 'socketUrl:""' /app/dist/impostor-frontend/browser/main*.js && echo "✅ Production config OK" || echo "❌ Production config FAILED"

# ---------- RUN ----------
FROM nginx:alpine
# Copia el build de Angular directamente
COPY --from=build /app/dist/impostor-frontend/browser/ /usr/share/nginx/html/
# Copia configuración SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
