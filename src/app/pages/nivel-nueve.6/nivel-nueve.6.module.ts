import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelNueve6PageRoutingModule } from './nivel-nueve.6-routing.module';

import { NivelNueve6Page } from './nivel-nueve.6.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelNueve6PageRoutingModule
  ],
  declarations: [NivelNueve6Page]
})
export class NivelNueve6PageModule {}
