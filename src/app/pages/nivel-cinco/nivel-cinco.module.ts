import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCincoPageRoutingModule } from './nivel-cinco-routing.module';

import { NivelCincoPage } from './nivel-cinco.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCincoPageRoutingModule
  ],
  declarations: [NivelCincoPage]
})
export class NivelCincoPageModule {}
