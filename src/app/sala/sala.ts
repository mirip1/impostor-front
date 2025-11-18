import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { io } from 'socket.io-client';
import { ruta } from '../../common/enviroment';
import { SocketService } from '../services/socketservice';

@Component({
  standalone: true,
  selector: 'app-sala',
  templateUrl: './sala.html',
  styleUrls: ['./sala.css'],
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
})
export class SalaComponent implements OnInit, OnDestroy {
  socket: any;
  roomId = '';
  jugadores: any[] = [];
  nombreJugador = '';
  esCreador = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private socketSvc: SocketService,
  ) {}

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id') || '';
    this.nombreJugador = localStorage.getItem('nombreJugador') || 'Jugador';

    /* REJOIN SI SE RECONECTA */
    this.socketSvc.socket.on("connect", () => {
      this.socketSvc.socket.emit('join-room', { roomId: this.roomId, playerName: this.nombreJugador });
    });

    /* UNIRSE A LA ROOM *ANTES DE LOS LISTENERS* */
    this.socketSvc.socket.emit('join-room', { roomId: this.roomId, playerName: this.nombreJugador });

    /* PEDIR LISTA */
    this.socketSvc.socket.emit('player-list-room', { roomId: this.roomId });

    /* PLAYER LIST */
    this.socketSvc.socket.on('player-list', (data: any) => {
      this.ngZone.run(() => {
        this.jugadores = data.players || [];
        this.esCreador = this.socketSvc.getId() === data.ownerId;
      });
    });

    /* ROUND START → AHORA SIEMPRE LLEGA */
    this.socketSvc.socket.on("round-start", (data) => {
      localStorage.setItem("roundStartPayload", JSON.stringify(data));

      this.ngZone.run(() => {
        this.router.navigate(['/juego', this.roomId]);
      });
    });
  }

  copiarCodigo() {
    navigator.clipboard.writeText(this.roomId);
    alert('Código copiado al portapapeles');
  }

  iniciarPartida() {
    this.socketSvc.socket.emit('start-round', this.roomId);
  }

  salirSala() {
    this.socketSvc.socket.emit('leave-room', { roomId: this.roomId });
    localStorage.removeItem('esCreador'); 
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.socketSvc.off('player-list');
  }
}
