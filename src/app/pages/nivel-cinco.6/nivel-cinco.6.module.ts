import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCinco6PageRoutingModule } from './nivel-cinco.6-routing.module';

import { NivelCinco6Page } from './nivel-cinco.6.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCinco6PageRoutingModule
  ],
  declarations: [NivelCinco6Page]
})
export class NivelCinco6PageModule {}
