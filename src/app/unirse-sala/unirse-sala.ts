// src/app/unirse-sala/unirse-sala.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { ruta } from '../../common/enviroment';

@Component({
  standalone: true,
  selector: 'app-unirse-sala',
  templateUrl: './unirse-sala.html',
  styleUrls: ['./unirse-sala.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
})
export class UnirseSalaComponent implements OnDestroy {
  nombreJugador = '';
  codigoSala = '';
  cargando = false;

  private socket: Socket;
  private onPlayerList = (players: any) => {};
  private onError = (err: any) => {};

  constructor(private router: Router) {
    this.socket = io(ruta);

    this.onPlayerList = (players: any) => {
      const roomId = this.codigoSala ? this.codigoSala.trim().toUpperCase() : '';
      this.cargando = false;
      if (roomId) {
        this.router.navigate(['/sala', roomId]);
      }
    };

    this.onError = (err: any) => {
      this.cargando = false;
      const txt = err && err.message ? err.message : String(err);
      alert(`Error: ${txt}`);
    };

    this.socket.on('player-list', this.onPlayerList);
    this.socket.on('error', this.onError);
  }

  unirseSala() {
    if (!this.nombreJugador.trim() || !this.codigoSala.trim()) return;
    this.cargando = true;

    const roomId = this.codigoSala.trim().toUpperCase();
    const playerName = this.nombreJugador.trim();

    this.socket.emit('join-room', { roomId, playerName });

  }

  volverHome() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.off('player-list', this.onPlayerList);
      this.socket.off('error', this.onError);
    }
  }
}
