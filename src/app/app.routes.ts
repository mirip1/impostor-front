import { Routes } from '@angular/router';
import { UnirseSalaComponent } from './unirse-sala/unirse-sala';
import { CrearSalaComponent } from './crear-sala/crear-sala';
import { SalaComponent } from './sala/sala';
import { JuegoComponent } from './juego/juego';
import { ResultadosComponent } from './resultados/resultados';
import { HomeComponent } from './home/home';

export const APP_ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'crear-sala', component: CrearSalaComponent },
  { path: 'unirse-sala', component: UnirseSalaComponent },
  { path: 'sala/:id', component: SalaComponent },
  { path: 'juego/:id', component: JuegoComponent },
  { path: 'resultados/:id', component: ResultadosComponent },
  { path: '**', redirectTo: 'home' }  
];