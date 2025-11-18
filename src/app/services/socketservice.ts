// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { ruta } from '../../common/enviroment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket: Socket;
  public connected = false;

  constructor() {
    // Conectamos una sola vez al crear el servicio
    this.socket = io(ruta, { autoConnect: true });

    this.socket.on('connect', () => {
      console.log('Socket conectado (service):', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket desconectado (service):', reason);
      this.connected = false;
    });
  }

  // helper para emitir con callback (opcional)
  emitWithAck(event: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.socket.emit(event, payload, (res: any) => resolve(res));
      } catch (err) {
        reject(err);
      }
    });
  }

  getId(): string | undefined {
    return this.socket.id;
  }

  // opcional: para limpiar listeners
  off(event: string, cb?: any) {
    this.socket.off(event, cb);
  }
}
