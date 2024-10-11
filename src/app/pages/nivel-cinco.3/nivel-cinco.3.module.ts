import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelCinco3PageRoutingModule } from './nivel-cinco.3-routing.module';

import { NivelCinco3Page } from './nivel-cinco.3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelCinco3PageRoutingModule
  ],
  declarations: [NivelCinco3Page]
})
export class NivelCinco3PageModule {}
