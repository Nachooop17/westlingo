import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCinco2PageRoutingModule } from './nivel-cinco.2-routing.module';

import { NivelCinco2Page } from './nivel-cinco.2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCinco2PageRoutingModule
  ],
  declarations: [NivelCinco2Page]
})
export class NivelCinco2PageModule {}
