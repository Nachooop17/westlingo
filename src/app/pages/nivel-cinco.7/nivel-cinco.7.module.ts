import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCinco7PageRoutingModule } from './nivel-cinco.7-routing.module';

import { NivelCinco7Page } from './nivel-cinco.7.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCinco7PageRoutingModule
  ],
  declarations: [NivelCinco7Page]
})
export class NivelCinco7PageModule {}
