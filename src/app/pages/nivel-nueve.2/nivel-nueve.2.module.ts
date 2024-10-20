import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelNueve2PageRoutingModule } from './nivel-nueve.2-routing.module';

import { NivelNueve2Page } from './nivel-nueve.2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelNueve2PageRoutingModule
  ],
  declarations: [NivelNueve2Page]
})
export class NivelNueve2PageModule {}
