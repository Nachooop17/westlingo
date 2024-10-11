import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCinco4PageRoutingModule } from './nivel-cinco.4-routing.module';

import { NivelCinco4Page } from './nivel-cinco.4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCinco4PageRoutingModule
  ],
  declarations: [NivelCinco4Page]
})
export class NivelCinco4PageModule {}
