import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelNueve4PageRoutingModule } from './nivel-nueve.4-routing.module';

import { NivelNueve4Page } from './nivel-nueve.4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelNueve4PageRoutingModule
  ],
  declarations: [NivelNueve4Page]
})
export class NivelNueve4PageModule {}
