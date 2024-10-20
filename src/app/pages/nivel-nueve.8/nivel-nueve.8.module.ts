import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelNueve8PageRoutingModule } from './nivel-nueve.8-routing.module';

import { NivelNueve8Page } from './nivel-nueve.8.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelNueve8PageRoutingModule
  ],
  declarations: [NivelNueve8Page]
})
export class NivelNueve8PageModule {}
