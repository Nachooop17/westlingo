import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelNueve1PageRoutingModule } from './nivel-nueve.1-routing.module';

import { NivelNueve1Page } from './nivel-nueve.1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelNueve1PageRoutingModule
  ],
  declarations: [NivelNueve1Page]
})
export class NivelNueve1PageModule {}
