import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCinco1PageRoutingModule } from './nivel-cinco.1-routing.module';

import { NivelCinco1Page } from './nivel-cinco.1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCinco1PageRoutingModule
  ],
  declarations: [NivelCinco1Page]
})
export class NivelCinco1PageModule {}
