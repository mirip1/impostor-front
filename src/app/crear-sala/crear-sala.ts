import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { ruta } from '../../common/enviroment';

@Component({
  selector: 'app-crear-sala',
  templateUrl: './crear-sala.html',
  styleUrls: ['./crear-sala.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
})
export class CrearSalaComponent {
  socket: any;
  nombreJugador = '';
  cargando = false;
  
  constructor(private router: Router) {
    this.socket = io(ruta);
  }

  crearSala() {
    if (!this.nombreJugador.trim()) return;
    this.cargando = true;
    localStorage.setItem('nombreJugador', this.nombreJugador.trim());
    this.socket.emit('create-room', { name: this.nombreJugador }, (response: any) => {
      this.cargando = false;
      if (response && response.roomId) {
        this.socket.emit('join-room', { roomId: response.roomId, playerName: this.nombreJugador});
        this.router.navigate(['/sala', response.roomId]);
      } else {
        alert('Error al crear la sala.');
      }
    });
  }

  volverHome() {
    this.router.navigate(['/home']);
  }
}
