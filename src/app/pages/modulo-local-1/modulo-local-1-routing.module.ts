import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuloLocal1Page } from './modulo-local-1.page';

const routes: Routes = [
  {
    path: '',
    component: ModuloLocal1Page
  }
];
console.log('ModuloLocal1PageRoutingModule: Rutas cargadas'); 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuloLocal1PageRoutingModule {
  
}
