import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { io } from 'socket.io-client';
import { ruta } from '../../common/enviroment';

interface Jugador {
  id: string;
  name: string;
  eliminated?: boolean;
}

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
  jugadores: Jugador[] = [];
  nombreJugador = '';
  esCreador = false;
  mySocketId = '';

  constructor(private route: ActivatedRoute, private router: Router, private ngZone: NgZone) {
    this.socket = io(ruta);
  }

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id') || '';
    this.nombreJugador = localStorage.getItem('nombreJugador') || 'Jugador';
    this.esCreador = localStorage.getItem('esCreador') === 'true';

    // Pedimos nuestro socketId al backend
    this.socket.emit('request-socket-id');
    this.socket.on('your-socket-id', (id: string) => {
      this.mySocketId = id;

      // Una vez que tenemos nuestro ID, pedimos la lista de jugadores
      this.socket.emit('player-list-room', { roomId: this.roomId });
    });

    // Escuchar lista de jugadores
    this.socket.on('player-list', (data: any) => {
      this.ngZone.run(() => {
        if (data && data.players) {
          this.jugadores = data.players;
          // Comprobar si somos el owner usando nuestro socketId
          this.esCreador = this.mySocketId === data.ownerId;
        }
      });
    });

    // Escuchar inicio de partida
    this.socket.on('game-started', () => {
      alert('¡La partida ha comenzado!');
    });
  }

  copiarCodigo() {
    navigator.clipboard.writeText(this.roomId);
    alert('Código copiado al portapapeles');
  }

  iniciarPartida() {
    this.socket.emit('start-game', { roomId: this.roomId });
  }

  salirSala() {
    this.socket.emit('leave-room', { roomId: this.roomId, name: this.nombreJugador });
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }
}
