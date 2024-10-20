import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelNueve3PageRoutingModule } from './nivel-nueve.3-routing.module';

import { NivelNueve3Page } from './nivel-nueve.3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelNueve3PageRoutingModule
  ],
  declarations: [NivelNueve3Page]
})
export class NivelNueve3PageModule {}
