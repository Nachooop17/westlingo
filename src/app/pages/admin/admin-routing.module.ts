import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage
    
  },
  {
    path: 'usuarios/:idusuario',
    loadChildren: () => import('../admin-usuarios/admin-usuarios.module').then(m => m.AdminUsuariosPageModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
