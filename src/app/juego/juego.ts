import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../services/socketservice';

@Component({
  standalone: true,
  selector: 'app-juego',
  templateUrl: './juego.html',
  styleUrls: ['./juego.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule
  ],
})
export class JuegoComponent implements OnInit, OnDestroy {
  roomId = '';
  jugadores: any[] = [];
  ownerId: string | null = null;
  myId: string | undefined;
  myName = '';

  // NUEVO → indica si este cliente es el creador de la sala
  esCreador = false;

  // Estado de la ronda
  roundActive = false;
  myRole: 'impostor' | 'player' | null = null;
  myWord: string | null = null;
  eliminated = false;

  // Votaciones
  votesCount = 0;
  lastVoteResult: any = null;
  voteLocked = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socketSvc: SocketService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    const savedPayload = localStorage.getItem("roundStartPayload");
    if (savedPayload) {
      const payload = JSON.parse(savedPayload);

      this.myRole = payload.role;
      this.myWord = payload.word ?? null;
      this.roundActive = true;

      // limpiamos
      localStorage.removeItem("roundStartPayload");
    }

    this.roomId = this.route.snapshot.paramMap.get('id') || '';
    this.myName = localStorage.getItem('nombreJugador') || 'Jugador';

    this.myId = this.socketSvc.getId();

    // entrar en la sala
    this.socketSvc.socket.emit('join-room', { roomId: this.roomId, playerName: this.myName });

    // pedir situación inicial
    this.socketSvc.socket.emit('player-list-room', { roomId: this.roomId });

    // ───────────────────────────────
    // LISTENER — player-list
    // ───────────────────────────────
    this.socketSvc.socket.on('player-list', (data: any) => {
      this.ngZone.run(() => {
        // si el servidor envía directamente un array -> data = [..players..]
        if (Array.isArray(data)) {
          this.jugadores = data;
          this.ownerId = null;
        } else if (data && Array.isArray(data.players)) {
          this.jugadores = data.players;
          this.ownerId = data.ownerId ?? null;
        } else {
          // valor por defecto seguro
          this.jugadores = [];
          this.ownerId = null;
        }

        // actualizar id local y si soy creador
        this.myId = this.socketSvc.getId();
        this.esCreador = !!(this.myId && this.ownerId && this.myId === this.ownerId);
      });
    });

    // ───────────────────────────────
    // LISTENER — round-start
    // ───────────────────────────────
    this.socketSvc.socket.on('round-start', (payload: any) => {
      console.log("ROUND START EN JUEGO", payload);

      this.ngZone.run(() => {
        this.myRole = payload.role ?? null;
        this.myWord = payload.word ?? null;
        this.eliminated = false;

        this.roundActive = true;
        this.voteLocked = false;
        this.lastVoteResult = null;
      });
    });

    // ───────────────────────────────
    // LISTENER — round-info
    // ───────────────────────────────
    this.socketSvc.socket.on('round-info', (payload: any) => {
      this.ngZone.run(() => {
        this.roundActive = !!payload.roundActive;
      });
    });

    // ───────────────────────────────
    // LISTENER — vote-update
    // ───────────────────────────────
    this.socketSvc.socket.on('vote-update', (payload: any) => {
      this.ngZone.run(() => {
        this.votesCount = payload.votesCount;
      });
    });

    // ───────────────────────────────
    // LISTENER — vote-result
    // ───────────────────────────────
    this.socketSvc.socket.on('vote-result', (payload: any) => {
      this.ngZone.run(() => {
        this.lastVoteResult = payload;

        if (payload.eliminated?.id === this.myId) {
          this.eliminated = true;
        }

        this.voteLocked = true;
        this.roundActive = false;
      });
    });
  }

  votar(targetId: string | null) {
    if (!this.roundActive || this.voteLocked || this.eliminated) return;

    this.voteLocked = true;
    this.socketSvc.socket.emit('vote', { roomId: this.roomId, targetId });
  }

  terminarRonda() {
    if (!this.esCreador) return;
    this.socketSvc.socket.emit('end-round', this.roomId);
  }

  salir() {
    this.socketSvc.socket.emit('leave-room', { roomId: this.roomId });
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.socketSvc.off('player-list');
    this.socketSvc.off('round-start');
    this.socketSvc.off('round-info');
    this.socketSvc.off('vote-update');
    this.socketSvc.off('vote-result');
  }
}
