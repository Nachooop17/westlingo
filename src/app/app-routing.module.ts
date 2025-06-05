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
    path: 'level-detail/:id',
    // CAMBIO CLAVE AQUÍ: Usar loadComponent para cargar directamente el componente standalone
    loadComponent: () => import('./pages/level-detail/level-detail.page').then( m => m.LevelDetailPage)
  },
  {
  path: 'level-detail/:levelId/sublevel/:sublevelId', // Ruta para un subnivel específico
  loadChildren: () => import('./pages/sublevel/sublevel.module').then( m => m.SublevelPageModule) 
  },
  {
    path: 'quiz-uno/:levelId/:subnivelId', // <--- CAMBIO CLAVE AQUÍ: AHORA INCLUYE subnivelId
    loadComponent: () => import('./pages/quiz-uno/quiz-uno.page').then( m => m.QuizUnoPage)
  },
  {
    path: 'quiz-dos/:levelId/:subnivelId', 
    loadComponent: () => import('./pages/quiz-dos/quiz-dos.page').then( m => m.QuizDosPage)
  },
  {
    path: 'recuperar',
    loadComponent: () => import('./pages/recuperar/recuperar.page').then( m => m.RecuperarPage)
  },
  {
    path: 'profile', // <--- NUEVA RUTA PARA EL PERFIL
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'quiz-tres/:levelId/:subnivelId', 
    loadComponent: () => import('./pages/quiz-tres/quiz-tres.page').then(m => m.QuizTresPage)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  }
  

  


  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
