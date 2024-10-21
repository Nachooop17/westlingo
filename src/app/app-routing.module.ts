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
    path: 'nivel-uno',
    loadChildren: () => import('./pages/nivel-uno/nivel-uno.module').then( m => m.NivelUnoPageModule)
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
    path: 'nivel-dos',
    loadChildren: () => import('./pages/nivel-dos/nivel-dos.module').then( m => m.NivelDosPageModule)
  },
  {
    path: 'nivel-dos.1',
    loadChildren: () => import('./pages/nivel-dos.1/nivel-dos.1.module').then( m => m.NivelDos1PageModule)
  },
  {
    path: 'nivel-dos.2',
    loadChildren: () => import('./pages/nivel-dos.2/nivel-dos.2.module').then( m => m.NivelDos2PageModule)
  },
  {
    path: 'nivel-dos.3',
    loadChildren: () => import('./pages/nivel-dos.3/nivel-dos.3.module').then( m => m.NivelDos3PageModule)
  },
  {
    path: 'nivel-dos.4',
    loadChildren: () => import('./pages/nivel-dos.4/nivel-dos.4.module').then( m => m.NivelDos4PageModule)
  },
  {
    path: 'nivel-dos.5',
    loadChildren: () => import('./pages/nivel-dos.5/nivel-dos.5.module').then( m => m.NivelDos5PageModule)
  },
  {
    path: 'nivel-dos.6',
    loadChildren: () => import('./pages/nivel-dos.6/nivel-dos.6.module').then( m => m.NivelDos6PageModule)
  },
  {
    path: 'nivel-dos.7',
    loadChildren: () => import('./pages/nivel-dos.7/nivel-dos.7.module').then( m => m.NivelDos7PageModule)
  },
  {
    path: 'nivel-dos.8',
    loadChildren: () => import('./pages/nivel-dos.8/nivel-dos.8.module').then( m => m.NivelDos8PageModule)
  },
  {
    path: 'user-management',
    loadChildren: () => import('./pages/user-management/user-management.module').then( m => m.UserManagementPageModule)
  },
  
  {
    path: 'nivel-tres',
    loadChildren: () => import('./pages/nivel-tres/nivel-tres.module').then( m => m.NivelTresPageModule)
  },
  {
    path: 'nivel-tres.1',
    loadChildren: () => import('./pages/nivel-tres.1/nivel-tres.1.module').then( m => m.NivelTres1PageModule)
  },
  {
    path: 'nivel-tres.2',
    loadChildren: () => import('./pages/nivel-tres.2/nivel-tres.2.module').then( m => m.NivelTres2PageModule)
  },
  {
    path: 'nivel-tres.3',
    loadChildren: () => import('./pages/nivel-tres.3/nivel-tres.3.module').then( m => m.NivelTres3PageModule)
  },
  {
    path: 'nivel-tres.4',
    loadChildren: () => import('./pages/nivel-tres.4/nivel-tres.4.module').then( m => m.NivelTres4PageModule)
  },
  {
    path: 'nivel-tres.5',
    loadChildren: () => import('./pages/nivel-tres.5/nivel-tres.5.module').then( m => m.NivelTres5PageModule)
  },
  {
    path: 'nivel-tres.6',
    loadChildren: () => import('./pages/nivel-tres.6/nivel-tres.6.module').then( m => m.NivelTres6PageModule)
  },
  {
    path: 'nivel-tres.7',
    loadChildren: () => import('./pages/nivel-tres.7/nivel-tres.7.module').then( m => m.NivelTres7PageModule)
  },
  {
    path: 'nivel-tres.8',
    loadChildren: () => import('./pages/nivel-tres.8/nivel-tres.8.module').then( m => m.NivelTres8PageModule)
  },
  {
    path: 'nivel-cuatro',
    loadChildren: () => import('./pages/nivel-cuatro/nivel-cuatro.module').then( m => m.NivelCuatroPageModule)
  },
  {
    path: 'nivel-cuatro.1',
    loadChildren: () => import('./pages/nivel-cuatro.1/nivel-cuatro.1.module').then( m => m.NivelCuatro1PageModule)
  },
  {
    path: 'nivel-cuatro.2',
    loadChildren: () => import('./pages/nivel-cuatro.2/nivel-cuatro.2.module').then( m => m.NivelCuatro2PageModule)
  },
  {
    path: 'nivel-cuatro.3',
    loadChildren: () => import('./pages/nivel-cuatro.3/nivel-cuatro.3.module').then( m => m.NivelCuatro3PageModule)
  },
  {
    path: 'nivel-cuatro.4',
    loadChildren: () => import('./pages/nivel-cuatro.4/nivel-cuatro.4.module').then( m => m.NivelCuatro4PageModule)
  },
  {
    path: 'nivel-cuatro.5',
    loadChildren: () => import('./pages/nivel-cuatro.5/nivel-cuatro.5.module').then( m => m.NivelCuatro5PageModule)
  },
  {
    path: 'nivel-cuatro.6',
    loadChildren: () => import('./pages/nivel-cuatro.6/nivel-cuatro.6.module').then( m => m.NivelCuatro6PageModule)
  },
  {
    path: 'nivel-cuatro.7',
    loadChildren: () => import('./pages/nivel-cuatro.7/nivel-cuatro.7.module').then( m => m.NivelCuatro7PageModule)
  },
  {
    path: 'nivel-cuatro.8',
    loadChildren: () => import('./pages/nivel-cuatro.8/nivel-cuatro.8.module').then( m => m.NivelCuatro8PageModule)
  },
  {
    path: 'nivel-cinco',
    loadChildren: () => import('./pages/nivel-cinco/nivel-cinco.module').then( m => m.NivelCincoPageModule)
  },
  {
    path: 'nivel-cinco.1',
    loadChildren: () => import('./pages/nivel-cinco.1/nivel-cinco.1.module').then( m => m.NivelCinco1PageModule)
  },
  {
    path: 'nivel-cinco.2',
    loadChildren: () => import('./pages/nivel-cinco.2/nivel-cinco.2.module').then( m => m.NivelCinco2PageModule)
  },
  {
    path: 'nivel-cinco.3',
    loadChildren: () => import('./pages/nivel-cinco.3/nivel-cinco.3.module').then( m => m.NivelCinco3PageModule)
  },
  {
    path: 'nivel-cinco.4',
    loadChildren: () => import('./pages/nivel-cinco.4/nivel-cinco.4.module').then( m => m.NivelCinco4PageModule)
  },
  {
    path: 'nivel-cinco.5',
    loadChildren: () => import('./pages/nivel-cinco.5/nivel-cinco.5.module').then( m => m.NivelCinco5PageModule)
  },
  {
    path: 'nivel-cinco.6',
    loadChildren: () => import('./pages/nivel-cinco.6/nivel-cinco.6.module').then( m => m.NivelCinco6PageModule)
  },
  {
    path: 'nivel-cinco.7',
    loadChildren: () => import('./pages/nivel-cinco.7/nivel-cinco.7.module').then( m => m.NivelCinco7PageModule)
  },
  {
    path: 'nivel-cinco.8',
    loadChildren: () => import('./pages/nivel-cinco.8/nivel-cinco.8.module').then( m => m.NivelCinco8PageModule)
  },
  {
    path: 'recuperar',
    loadChildren: () => import('./pages/recuperar/recuperar.module').then( m => m.RecuperarPageModule)
  },
  {
    path: 'nivel-seis',
    loadChildren: () => import('./pages/nivel-seis/nivel-seis.module').then( m => m.NivelSeisPageModule)
  },
  {
    path: 'nivel-seis.1',
    loadChildren: () => import('./pages/nivel-seis.1/nivel-seis.1.module').then( m => m.NivelSeis1PageModule)
  },
  {
    path: 'nivel-seis.2',
    loadChildren: () => import('./pages/nivel-seis.2/nivel-seis.2.module').then( m => m.NivelSeis2PageModule)
  },
  {
    path: 'nivel-seis.3',
    loadChildren: () => import('./pages/nivel-seis.3/nivel-seis.3.module').then( m => m.NivelSeis3PageModule)
  },
  {
    path: 'nivel-seis.4',
    loadChildren: () => import('./pages/nivel-seis.4/nivel-seis.4.module').then( m => m.NivelSeis4PageModule)
  },
  {
    path: 'nivel-seis.5',
    loadChildren: () => import('./pages/nivel-seis.5/nivel-seis.5.module').then( m => m.NivelSeis5PageModule)
  },
  {
    path: 'nivel-seis.6',
    loadChildren: () => import('./pages/nivel-seis.6/nivel-seis.6.module').then( m => m.NivelSeis6PageModule)
  },
  {
    path: 'nivel-seis.7',
    loadChildren: () => import('./pages/nivel-seis.7/nivel-seis.7.module').then( m => m.NivelSeis7PageModule)
  },
  {
    path: 'nivel-seis.8',
    loadChildren: () => import('./pages/nivel-seis.8/nivel-seis.8.module').then( m => m.NivelSeis8PageModule)
  },
  {
    path: 'nivel-siete',
    loadChildren: () => import('./pages/nivel-siete/nivel-siete.module').then( m => m.NivelSietePageModule)
  },
  {
    path: 'nivel-siete.1',
    loadChildren: () => import('./pages/nivel-siete.1/nivel-siete.1.module').then( m => m.NivelSiete1PageModule)
  },
  {
    path: 'nivel-siete.2',
    loadChildren: () => import('./pages/nivel-siete.2/nivel-siete.2.module').then( m => m.NivelSiete2PageModule)
  },
  {
    path: 'nivel-siete.3',
    loadChildren: () => import('./pages/nivel-siete.3/nivel-siete.3.module').then( m => m.NivelSiete3PageModule)
  },
  {
    path: 'nivel-siete.4',
    loadChildren: () => import('./pages/nivel-siete.4/nivel-siete.4.module').then( m => m.NivelSiete4PageModule)
  },
  {
    path: 'nivel-siete.5',
    loadChildren: () => import('./pages/nivel-siete.5/nivel-siete.5.module').then( m => m.NivelSiete5PageModule)
  },
  {
    path: 'nivel-siete.6',
    loadChildren: () => import('./pages/nivel-siete.6/nivel-siete.6.module').then( m => m.NivelSiete6PageModule)
  },
  {
    path: 'nivel-siete.7',
    loadChildren: () => import('./pages/nivel-siete.7/nivel-siete.7.module').then( m => m.NivelSiete7PageModule)
  },
  {
    path: 'nivel-siete.8',
    loadChildren: () => import('./pages/nivel-siete.8/nivel-siete.8.module').then( m => m.NivelSiete8PageModule)
  },
  {
    path: 'nivel-ocho',
    loadChildren: () => import('./pages/nivel-ocho/nivel-ocho.module').then( m => m.NivelOchoPageModule)
  },
  {
    path: 'nivel-ocho.1',
    loadChildren: () => import('./pages/nivel-ocho.1/nivel-ocho.1.module').then( m => m.NivelOcho1PageModule)
  },
  {
    path: 'nivel-ocho.2',
    loadChildren: () => import('./pages/nivel-ocho.2/nivel-ocho.2.module').then( m => m.NivelOcho2PageModule)
  },
  {
    path: 'nivel-ocho.3',
    loadChildren: () => import('./pages/nivel-ocho.3/nivel-ocho.3.module').then( m => m.NivelOcho3PageModule)
  },
  {
    path: 'nivel-ocho.4',
    loadChildren: () => import('./pages/nivel-ocho.4/nivel-ocho.4.module').then( m => m.NivelOcho4PageModule)
  },
  {
    path: 'nivel-ocho.5',
    loadChildren: () => import('./pages/nivel-ocho.5/nivel-ocho.5.module').then( m => m.NivelOcho5PageModule)
  },
  {
    path: 'nivel-ocho.6',
    loadChildren: () => import('./pages/nivel-ocho.6/nivel-ocho.6.module').then( m => m.NivelOcho6PageModule)
  },
  {
    path: 'nivel-ocho.7',
    loadChildren: () => import('./pages/nivel-ocho.7/nivel-ocho.7.module').then( m => m.NivelOcho7PageModule)
  },
  {
    path: 'nivel-ocho.8',
    loadChildren: () => import('./pages/nivel-ocho.8/nivel-ocho.8.module').then( m => m.NivelOcho8PageModule)
  },
  {
    path: 'nivel-nueve',
    loadChildren: () => import('./pages/nivel-nueve/nivel-nueve.module').then( m => m.NivelNuevePageModule)
  },
  {
    path: 'nivel-nueve.1',
    loadChildren: () => import('./pages/nivel-nueve.1/nivel-nueve.1.module').then( m => m.NivelNueve1PageModule)
  },
  {
    path: 'nivel-nueve.2',
    loadChildren: () => import('./pages/nivel-nueve.2/nivel-nueve.2.module').then( m => m.NivelNueve2PageModule)
  },
  {
    path: 'nivel-nueve.3',
    loadChildren: () => import('./pages/nivel-nueve.3/nivel-nueve.3.module').then( m => m.NivelNueve3PageModule)
  },
  {
    path: 'nivel-nueve.4',
    loadChildren: () => import('./pages/nivel-nueve.4/nivel-nueve.4.module').then( m => m.NivelNueve4PageModule)
  },
  {
    path: 'nivel-nueve.5',
    loadChildren: () => import('./pages/nivel-nueve.5/nivel-nueve.5.module').then( m => m.NivelNueve5PageModule)
  },
  {
    path: 'nivel-nueve.6',
    loadChildren: () => import('./pages/nivel-nueve.6/nivel-nueve.6.module').then( m => m.NivelNueve6PageModule)
  },
  {
    path: 'nivel-nueve.7',
    loadChildren: () => import('./pages/nivel-nueve.7/nivel-nueve.7.module').then( m => m.NivelNueve7PageModule)
  },
  {
    path: 'nivel-nueve.8',
    loadChildren: () => import('./pages/nivel-nueve.8/nivel-nueve.8.module').then( m => m.NivelNueve8PageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
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
