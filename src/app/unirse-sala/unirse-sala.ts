// src/app/unirse-sala/unirse-sala.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { SocketService } from '../services/socketservice';

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

  private onError = (err: any) => {};

  constructor(private router: Router, private socketSvc: SocketService) {
    this.onError = (err: any) => {
      this.cargando = false;
      const txt = err && err.message ? err.message : String(err);
      alert(`Error: ${txt}`);
    };
    this.socketSvc.socket.on('error', this.onError);
  }

  async unirseSala() {
    if (!this.nombreJugador.trim() || !this.codigoSala.trim()) return;
    this.cargando = true;

    const roomId = this.codigoSala.trim().toUpperCase();
    const playerName = this.nombreJugador.trim();

    localStorage.setItem('nombreJugador', playerName);
    localStorage.setItem('esCreador', 'false');

    const response: any = await this.socketSvc.emitWithAck('join-room', { roomId, playerName });

    this.cargando = false;
    if (!response || !response.success) {
      alert(response?.message || 'Error al entrar en la sala');
      return;
    }

    this.router.navigate(['/sala', roomId]);
  }

  volverHome() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.socketSvc.off('error', this.onError);
  }
}
