import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelNueve7PageRoutingModule } from './nivel-nueve.7-routing.module';

import { NivelNueve7Page } from './nivel-nueve.7.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelNueve7PageRoutingModule
  ],
  declarations: [NivelNueve7Page]
})
export class NivelNueve7PageModule {}
