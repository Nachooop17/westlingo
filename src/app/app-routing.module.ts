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
  { path: 'modulo',
     loadChildren: () => import('./pages/modulo-local-1/modulo-local-1.module').then(m => m.ModuloLocal1PageModule) },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'level-detail/:id', // <--- NUEVA RUTA con parámetro :id
    loadChildren: () => import('./pages/level-detail/level-detail.module').then( m => m.LevelDetailPageModule)
  },
  {
  path: 'level-detail/:levelId/sublevel/:sublevelId', // Ruta para un subnivel específico
  loadChildren: () => import('./pages/sublevel/sublevel.module').then( m => m.SublevelPageModule)
},
  {
    path: '**',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  },
    



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
