import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Asegúrate de que esto esté aquí
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UserService } from '@services/database.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,],
  providers: [ UserService, SQLite ,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
