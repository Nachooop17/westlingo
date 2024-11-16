import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'nivel-uno.1',
    loadChildren: () => import('./pages/nivel-uno.1/nivel-uno.1.module').then( m => m.NivelUno1PageModule)
  },
  {
    path: 'nivel-uno.2',
    loadChildren: () => import('./pages/nivel-uno.2/nivel-uno.2.module').then( m => m.NivelUno2PageModule)
  },
  {
    path: 'nivel-uno.3',
    loadChildren: () => import('./pages/nivel-uno.3/nivel-uno.3.module').then( m => m.NivelUno3PageModule)
  },
  {
    path: 'nivel-uno.4',
    loadChildren: () => import('./pages/nivel-uno.4/nivel-uno.4.module').then( m => m.NivelUno4PageModule)
  },
  {
    path: 'nivel-uno.5',
    loadChildren: () => import('./pages/nivel-uno.5/nivel-uno.5.module').then( m => m.NivelUno5PageModule)
  },
  {
    path: 'nivel-uno.6',
    loadChildren: () => import('./pages/nivel-uno.6/nivel-uno.6.module').then( m => m.NivelUno6PageModule)
  },
  {
    path: 'nivel-uno.7',
    loadChildren: () => import('./pages/nivel-uno.7/nivel-uno.7.module').then( m => m.NivelUno7PageModule)
  },
  {
    path: 'nivel-uno.8',
    loadChildren: () => import('./pages/nivel-uno.8/nivel-uno.8.module').then( m => m.NivelUno8PageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'cambioclave',
    loadChildren: () => import('./pages/cambioclave/cambioclave.module').then( m => m.CambioclavePageModule)
  },
  {
    path: 'cambionombre',
    loadChildren: () => import('./pages/cambionombre/cambionombre.module').then( m => m.CambionombrePageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  },
  {
    path: 'admin-usuarios',
    loadChildren: () => import('./pages/admin-usuarios/admin-usuarios.module').then( m => m.AdminUsuariosPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
