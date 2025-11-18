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
import { SocketService } from '../services/socketservice';

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
  
  constructor(private router: Router, private socketSvc: SocketService) {}

  async crearSala() {
    if (!this.nombreJugador.trim()) return;
    this.cargando = true;

    // guardamos nombre localmente para reutilizar
    localStorage.setItem('nombreJugador', this.nombreJugador);
    // marcamos que este cliente *es* el creador (atajo seguro si usas service)
    localStorage.setItem('esCreador', 'true');

    try {
      // usamos emit con callback a través del servicio
      const response = await this.socketSvc.emitWithAck('create-room', { name: this.nombreJugador });
      this.cargando = false;
      if (response && response.roomId) {
        this.router.navigate(['/sala', response.roomId]);
      } else {
        alert('Error al crear la sala');
      }
    } catch (err) {
      this.cargando = false;
      console.error(err);
      alert('Error al crear sala (socket)');
    }
  }

  volverHome() {
    this.router.navigate(['/home']);
  }
}
