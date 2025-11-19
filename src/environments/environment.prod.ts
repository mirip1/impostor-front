// Configuración para producción (VPS)
// Usa ruta relativa para aprovechar el proxy de nginx
export const environment = {
    production: true,
    socketUrl: '' // Ruta relativa - nginx proxy en /socket.io/
};
