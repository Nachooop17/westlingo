import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCinco8PageRoutingModule } from './nivel-cinco.8-routing.module';

import { NivelCinco8Page } from './nivel-cinco.8.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCinco8PageRoutingModule
  ],
  declarations: [NivelCinco8Page]
})
export class NivelCinco8PageModule {}
